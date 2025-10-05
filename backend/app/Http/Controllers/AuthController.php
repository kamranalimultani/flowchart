<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Step 1: User Registration
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'company_name' => 'required|string|max:255',
                'industry' => 'nullable|string|max:255',
                'subscription_type' => 'required|in:free_trial,paid',
            ]);

        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Check if email already exists (extra check)
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An account with this email already exists',
                    'error_code' => 'EMAIL_EXISTS',
                ], 409);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'subscription_type' => $request->subscription_type,
                'status' => $request->subscription_type === 'free_trial' ? 'active' : 'inactive',
            ]);

            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'industry' => $request->industry,
            ]);

            DB::commit();

            Log::info('User registered successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'subscription_type' => $user->subscription_type,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'subscription_type' => $user->subscription_type,
                    'status' => $user->status,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    public function createCheckout(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        $apiKey = config('lemonsqueezy.api_key');
        $storeId = config('lemonsqueezy.store_id');
        $variantId = config('lemonsqueezy.variant_id');

        if (empty($apiKey) || empty($storeId) || empty($variantId)) {
            return response()->json([
                'message' => 'Lemon Squeezy configuration is incomplete',
                'debug' => [
                    'has_api_key' => !empty($apiKey),
                    'has_store_id' => !empty($storeId),
                    'has_variant_id' => !empty($variantId),
                ]
            ], 500);
        }

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/vnd.api+json',
                'Content-Type' => 'application/vnd.api+json',
                'Authorization' => 'Bearer ' . $apiKey,
            ])->post('https://api.lemonsqueezy.com/v1/checkouts', [
                        'data' => [
                            'type' => 'checkouts',
                            'attributes' => [
                                'checkout_data' => [
                                    'email' => $user->email,
                                    'name' => $user->name,
                                    'custom' => [
                                        'user_id' => (string) $user->id,
                                    ],
                                ],
                                'checkout_options' => [
                                    'embed' => false,
                                    'media' => true,
                                    'logo' => true,
                                    'button_color' => '#2563eb',
                                ],
                                'redirect_url' => config('app.frontend_url') . '/payment-success',
                            ],
                            'relationships' => [
                                'store' => [
                                    'data' => [
                                        'type' => 'stores',
                                        'id' => (string) $storeId,
                                    ],
                                ],
                                'variant' => [
                                    'data' => [
                                        'type' => 'variants',
                                        'id' => (string) $variantId,
                                    ],
                                ],
                            ],
                        ],
                    ]);

            Log::info('Lemon Squeezy Response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            if ($response->successful()) {
                $checkout = $response->json();

                return response()->json([
                    'checkout_url' => $checkout['data']['attributes']['url'],
                    'checkout_id' => $checkout['data']['id'],
                ]);
            }

            return response()->json([
                'message' => 'Failed to create checkout',
                'error' => $response->json(),
                'status_code' => $response->status(),
            ], $response->status());

        } catch (\Exception $e) {
            Log::error('Checkout Creation Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Error creating checkout',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        $secret = config('lemonsqueezy.signing_secret');
        $signature = $request->header('X-Signature');

        // Verify webhook signature
        $hash = hash_hmac('sha256', $request->getContent(), $secret);

        if (!hash_equals($hash, $signature)) {
            Log::warning('Invalid webhook signature');
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $payload = $request->all();
        $eventName = $payload['meta']['event_name'] ?? null;

        Log::info('Webhook received', [
            'event' => $eventName,
            'payload' => $payload,
        ]);

        try {
            switch ($eventName) {
                case 'order_created':
                    $this->handleOrderCreated($payload);
                    break;

                case 'subscription_created':
                    $this->handleSubscriptionCreated($payload);
                    break;

                case 'subscription_updated':
                    $this->handleSubscriptionUpdated($payload);
                    break;

                case 'subscription_cancelled':
                    $this->handleSubscriptionCancelled($payload);
                    break;
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Webhook processing error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    protected function handleOrderCreated($payload)
    {
        $userId = $payload['meta']['custom_data']['user_id'] ?? null;

        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                $user->update([
                    'status' => 'active',
                    'lemon_squeezy_customer_id' => $payload['data']['attributes']['customer_id'] ?? null,
                ]);

                Log::info('Order created for user', ['user_id' => $userId]);
            }
        }
    }

    protected function handleSubscriptionCreated($payload)
    {
        $userId = $payload['meta']['custom_data']['user_id'] ?? null;

        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                $user->update([
                    'status' => 'active',
                    'subscription_id' => $payload['data']['id'],
                    'subscription_status' => $payload['data']['attributes']['status'],
                ]);

                Log::info('Subscription created for user', ['user_id' => $userId]);
            }
        }
    }

    protected function handleSubscriptionUpdated($payload)
    {
        $subscriptionId = $payload['data']['id'];

        $user = User::where('subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => $payload['data']['attributes']['status'],
                'status' => $payload['data']['attributes']['status'] === 'active' ? 'active' : 'inactive',
            ]);

            Log::info('Subscription updated', ['subscription_id' => $subscriptionId]);
        }
    }

    protected function handleSubscriptionCancelled($payload)
    {
        $subscriptionId = $payload['data']['id'];

        $user = User::where('subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'cancelled',
                'status' => 'inactive',
            ]);

            Log::info('Subscription cancelled', ['subscription_id' => $subscriptionId]);
        }
    }

    // Add this test method to your LemonSqueezyController
    public function testApiConnection()
    {
        $apiKey = config('lemonsqueezy.api_key');

        try {
            // Test 1: Get user info
            $userResponse = Http::withHeaders([
                'Accept' => 'application/vnd.api+json',
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get('https://api.lemonsqueezy.com/v1/users/me');

            Log::info('User API Test', [
                'status' => $userResponse->status(),
                'body' => $userResponse->json(),
            ]);

            // Test 2: Get stores
            $storesResponse = Http::withHeaders([
                'Accept' => 'application/vnd.api+json',
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get('https://api.lemonsqueezy.com/v1/stores');

            Log::info('Stores API Test', [
                'status' => $storesResponse->status(),
                'body' => $storesResponse->json(),
            ]);

            // Test 3: Get products
            $productsResponse = Http::withHeaders([
                'Accept' => 'application/vnd.api+json',
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get('https://api.lemonsqueezy.com/v1/products');

            return response()->json([
                'user_test' => [
                    'status' => $userResponse->status(),
                    'success' => $userResponse->successful(),
                    'data' => $userResponse->json(),
                ],
                'stores_test' => [
                    'status' => $storesResponse->status(),
                    'success' => $storesResponse->successful(),
                    'data' => $storesResponse->json(),
                ],
                'products_test' => [
                    'status' => $productsResponse->status(),
                    'success' => $productsResponse->successful(),
                    'data' => $productsResponse->json(),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    // Get User by Token
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
