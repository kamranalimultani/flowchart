<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SharedFlow;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FlowSharedController extends Controller
{
    public function share($flowId, Request $request)
    {
        $user = $request->user(); // assuming Sanctum or auth middleware

        // Check if already shared
        $existing = SharedFlow::where('user_id', $user->id)
            ->where('flow_id', $flowId)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Flow already shared',
                'share_uuid' => $existing->share_uuid,
            ]);
        }

        // Create share
        $sharedFlow = SharedFlow::create([
            'user_id' => $user->id,
            'flow_id' => $flowId,
            'share_uuid' => Str::uuid(),
        ]);

        return response()->json([
            'message' => 'Flow shared successfully',
            'share_uuid' => $sharedFlow->share_uuid,
        ]);
    }
}
