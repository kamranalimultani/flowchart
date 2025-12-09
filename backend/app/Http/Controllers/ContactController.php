<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'message' => 'required|string',
            'recaptcha_token' => 'required|string',
        ]);

        $recaptchaSecret = env('RECAPTCHA_SECRET_KEY');
        if ($recaptchaSecret) {
            $response = \Illuminate\Support\Facades\Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $recaptchaSecret,
                'response' => $request->recaptcha_token,
            ]);

            if (!$response->json('success')) {
                return response()->json(['message' => 'ReCAPTCHA verification failed.'], 422);
            }
        }

        $data = $request->all();

        try {
            Mail::to('info@melvok.com')->send(new \App\Mail\ContactFormMail($data));
        } catch (\Exception $e) {
            Log::error('Mail send failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send email.'], 500);
        }

        return response()->json(['message' => 'Message sent successfully!']);
    }
}
