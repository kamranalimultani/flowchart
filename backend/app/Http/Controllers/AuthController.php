<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Step 1: User Registration
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'inactive', // becomes active after company step
            'subscription_type' => 'none'
        ]);

        return response()->json([
            'message' => 'User registered. Please provide company details.',
            'user_id' => $user->id
        ], 201);
    }

    // Step 2: Company Details
    public function registerCompany(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_name' => 'required',
        ]);

        $company = Company::create([
            'user_id' => $request->user_id,
            'company_name' => $request->company_name,
            'industry' => $request->industry,
            'website' => $request->website,
        ]);

        // Activate user
        $user = User::find($request->user_id);
        $user->update(['status' => 'active', 'subscription_type' => 'free_trial']);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Company details saved. User active.',
            'token' => $token,
            'user' => $user
        ], 201);
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
