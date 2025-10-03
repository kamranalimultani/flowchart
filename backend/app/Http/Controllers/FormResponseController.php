<?php
namespace App\Http\Controllers;

use App\Models\FormResponse;
use Illuminate\Http\Request;

class FormResponseController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'flow_id' => 'required|exists:flows,id',
            'form_template_id' => 'required|exists:form_templates,id',
            'node_id' => 'required|string',
            'response' => 'required|array',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $response = FormResponse::create($data);

        return response()->json([
            'message' => 'Form response saved successfully',
            'data' => $response->load(['flow', 'formTemplate', 'user']),
        ]);
    }

    // Get all responses for a given flow + form + node
    public function index($flowId, $formTemplateId, $nodeId)
    {
        $responses = FormResponse::with(['user', 'flow', 'formTemplate'])
            ->where('flow_id', $flowId)
            ->where('form_template_id', $formTemplateId)
            ->where('node_id', $nodeId)
            ->get();

        return response()->json($responses);
    }
}
