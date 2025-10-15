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
use Illuminate\Support\Facades\Auth;

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
            // ✅ Create company with subscription info
            $company = Company::create([
                'company_name' => $request->company_name,
                'industry' => $request->industry,
                'subscription_type' => $request->subscription_type,
                'status' => $request->subscription_type === 'free_trial' ? 'active' : 'pending_payment',
            ]);

            // ✅ Create the admin user for the company
            $user = User::create([
                'name' => $request->name,
                'role' => "admin",
                'email' => $request->email,
                'company_id' => $company->id,
                'password' => Hash::make($request->password),
            ]);

            // ✅ Handle free trial
            if ($request->subscription_type === 'free_trial') {
                DB::commit();

                try {
                    Mail::to($user->email)->send(new WelcomeMail($user->name));
                } catch (\Exception $mailException) {
                    Log::error('Mail send failed', ['error' => $mailException->getMessage()]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Registration successful (Free Trial)',
                    'company' => $company,
                    'user' => $user,
                ], 201);
            }

            // 🔹 Paid plan mapping
            $planMap = [
                'paid_999' => 'plan_RSUmtbiVGvFK2r',
                'paid_1999' => 'plan_RSgmLnYV6DMssu',
            ];

            if (!isset($planMap[$request->subscription_type])) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid subscription plan selected',
                ], 400);
            }

            $planId = $planMap[$request->subscription_type];

            // ✅ Create Razorpay subscription
            $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            $subscription = $api->subscription->create([
                'plan_id' => $planId,
                'total_count' => 12,
                'customer_notify' => 1,
                'notes' => [
                    'company_id' => $company->id,
                    'email' => $user->email,
                ],
            ]);
            $razorpayStatus = $subscription->status;

            $statusMap = [
                'created' => 'pending_payment',  // Razorpay just created the sub, waiting for user payment
                'authenticated' => 'pending_payment',
                'active' => 'active',            // Payment successful
                'halted' => 'inactive',          // Subscription stopped
                'cancelled' => 'cancelled',
                'completed' => 'active',
                'expired' => 'inactive',
                'pending' => 'pending_payment',
            ];

            // ✅ Update company with subscription info
            $company->update([
                'subscription_id' => $subscription->id,
                'status' => $statusMap[$razorpayStatus] ?? 'pending_payment',
            ]);

            DB::commit();

            try {
                Mail::to($user->email)->send(new WelcomeMail($user->name));
            } catch (\Exception $mailException) {
                Log::error('Mail send failed', ['error' => $mailException->getMessage()]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Subscription created. Complete payment to activate account.',
                'razorpay_key' => env('RAZORPAY_KEY_ID'),
                'subscription_id' => $subscription->id,
                'company_id' => $company->id,
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

            // ✅ Update company after successful payment
            Company::where('subscription_id', $request->razorpay_subscription_id)
                ->update(['status' => 'active']);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully and company subscription activated.',
            ]);
        } catch (\Exception $e) {
            Company::where('subscription_id', $request->razorpay_subscription_id)
                ->update(['status' => 'payment_failed']);

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

    public function companyUsers(Request $request)
    {
        try {
            $authUser = Auth::user();

            if (!$authUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }

            // Fetch all users in the same company except the logged-in user
            $users = User::where('company_id', $authUser->company_id)
                ->where('id', '!=', $authUser->id)
                ->get(['id', 'name', 'email']);

            return response()->json([
                'success' => true,
                'users_count' => $users->count(),
                'users' => $users,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Failed to fetch company users', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while fetching users.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }


    // ✅ Create a new user
    public function store(Request $request)
    {
        $authUser = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_id' => $authUser->company_id,
            'role' => 'employee',
            'status' => 'active',
        ]);

        return response()->json(['success' => true, 'user' => $user], 201);
    }

    // ✅ Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$id}",
            'password' => 'nullable|string|min:6',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => !empty($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);

        return response()->json(['success' => true, 'user' => $user]);
    }
}
