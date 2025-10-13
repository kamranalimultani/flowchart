<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
// Step 1: User Registration
use Razorpay\Api\Api;

use Illuminate\Validation\ValidationException;
class AuthController extends Controller
{


    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'company_name' => 'required|string|max:255',
                'industry' => 'nullable|string|max:255',
                'subscription_type' => 'required|in:free_trial,paid_999,paid_1999',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'subscription_type' => $request->subscription_type,
                'status' => $request->subscription_type === 'free_trial' ? 'active' : 'pending_payment',
            ]);

            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'industry' => $request->industry,
            ]);

            // 🔹 Map subscription_type to Razorpay plan_id
            $planMap = [
                'paid_999' => 'plan_RSUmtbiVGvFK2r',   // Replace with actual plan ID in Razorpay
                'paid_1999' => 'plan_RSgmLnYV6DMssu',  // Replace with actual plan ID in Razorpay
            ];

            // Free trial
            if ($request->subscription_type === 'free_trial') {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'subscription_type' => 'free_trial',
                    'status' => 'active',
                ]);

                Company::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company_name,
                    'industry' => $request->industry,
                ]);

                DB::commit();

                try {
                    Mail::to($user->email)->send(new WelcomeMail($user->name));
                } catch (\Exception $mailException) {
                    Log::error('Mail send failed', ['error' => $mailException->getMessage()]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Registration successful (Free Trial)',
                    'user' => $user,
                ], 201);
            }

            // Paid plans
            if (!isset($planMap[$request->subscription_type])) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid subscription plan selected',
                ], 400);
            }

            $planId = $planMap[$request->subscription_type];

            // Create Razorpay subscription
            $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            $subscription = $api->subscription->create([
                'plan_id' => $planId,
                'total_count' => 12,
                'customer_notify' => 1,
                'notes' => [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ],
            ]);

            DB::table('subscriptions')->insert([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'plan_id' => $planId,
                'status' => $subscription->status,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Subscription created. Complete payment to activate account.',
                'razorpay_key' => env('RAZORPAY_KEY_ID'),
                'subscription_id' => $subscription->id,
                'user_id' => $user->id,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration failed', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function verifyPayment(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

        try {
            $attributes = [
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_subscription_id' => $request->razorpay_subscription_id,
                'razorpay_signature' => $request->razorpay_signature,
            ];

            $api->utility->verifyPaymentSignature($attributes);

            // Update DB after verification
            DB::table('subscriptions')
                ->where('subscription_id', $request->razorpay_subscription_id)
                ->update(['status' => 'active']);

            User::where('id', $request->user_id)->update(['status' => 'active']);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully and subscription activated.',
            ]);
        } catch (\Exception $e) {
            DB::table('subscriptions')
                ->where('subscription_id', $request->razorpay_subscription_id)
                ->update(['status' => 'failed']);

            User::where('id', $request->user_id)->update(['status' => 'payment_failed']);

            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }


    // Login
    public function login(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'No account found with this email address.',
                    'error_code' => 'USER_NOT_FOUND',
                ], 404);
            }

            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password. Please try again.',
                    'error_code' => 'INVALID_PASSWORD',
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Login failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred during login. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }


    // Get User by Token
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
