<?php

namespace App\Http\Middleware;

use App\Models\Flow;
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
        $user = $request->user();
        Log::info($user);
        if ($user->subscription_type === 'free_trial') {
            $flowCount = Flow::where('user_id', $user->id)->count();

            if ($flowCount >= 3) {
                return response()->json(['message' => 'Yout free plan limit exceeded. Upgrade you plan!'], 403);
            }
        }

        return $next($request);
    }
}
