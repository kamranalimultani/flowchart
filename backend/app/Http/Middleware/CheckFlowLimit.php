<?php

namespace App\Http\Middleware;

use App\Models\Flow;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Log;
use Symfony\Component\HttpFoundation\Response;

class CheckFlowLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authUser = $request->user();

        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // ✅ Fetch latest user with company relationship
        $user = User::with('company')->find($authUser->id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$user->company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        Log::info("Company subscription check:", [
            'company_id' => $user->company->id,
            'subscription_type' => $user->company->subscription_type ?? 'none',
            'user_id' => $user->id,
        ]);

        // ✅ Normalize the subscription type
        $subscriptionType = strtolower(trim($user->company->subscription_type ?? 'none'));
        $companyStatus = $user->company->status;

        // ✅ Apply free trial restriction
        if ($subscriptionType === 'free_trial') {
            // Count all flows created by users of the same company
            $flowCount = Flow::whereIn('user_id', $user->company->users->pluck('id'))->count();

            if ($flowCount >= 3) {
                return response()->json([
                    'message' => 'Your company’s free plan limit has been exceeded. Please upgrade your plan!',
                ], 403);
            }
        } else {
            Log::info("Company subscription check:", [
                'company_id' => $user->company->id,
                'subscription_type' => $user->company->status ?? 'none',
                'user_id' => $user->id,
            ]);

            // 💳 Paid plan logic — ensure subscription is active
            if ($companyStatus !== 'active') {
                return response()->json([
                    'message' => 'Your subscription is not active. Please complete your payment to continue.',
                ], 403);
            }
        }

        return $next($request);
    }
}
