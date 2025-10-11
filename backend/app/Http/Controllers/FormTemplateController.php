<?php

namespace App\Http\Controllers;

use App\Models\FormTemplate;
use Illuminate\Http\Request;

class FormTemplateController extends Controller
{
    // GET /api/form-templates?page=1&per_page=10
    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 10);
        $query = FormTemplate::query()->select(['id', 'title', 'form_data', 'created_at'])->where('user_id', $request->user()->id); // only user's templates


        // optional search ?q=login
        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'like', "%{$q}%");
        }

        return response()->json($query->paginate($perPage));
    }
    public function fetchAll(Request $request)
    {
        $query = FormTemplate::query()->select(['id', 'title', 'form_data', 'created_at'])->where('user_id', $request->user()->id); // only user's templates;

        return response()->json($query->get());
    }
    public function fetchFormsForShared(Request $request)
    {
        $shareUuid = $request->query('share_uuid');

        if (!$shareUuid) {
            return response()->json(['error' => 'share_uuid is required'], 500);
        }

        // Step 1: Find the shared flow by UUID
        $sharedFlow = \App\Models\SharedFlow::where('share_uuid', $shareUuid)->first();

        if (!$sharedFlow) {
            return response()->json(['error' => 'Invalid share UUID'], 500);
        }

        // Step 2: Fetch the flow details
        $flow = \App\Models\Flow::find($sharedFlow->flow_id);

        if (!$flow) {
            return response()->json(['error' => 'Flow not found'], 404);
        }

        // Step 3: Extract form_template IDs from node_data
        $nodeData = json_decode($flow->node_data, true) ?? [];
        $formTemplateIds = collect($nodeData)
            ->pluck('form_templates')
            ->flatten()
            ->unique()
            ->values()
            ->all();

        // Step 4: Fetch the corresponding form templates
        $formTemplates = \App\Models\FormTemplate::whereIn('id', $formTemplateIds)
            ->select(['id', 'title', 'form_data', 'created_at'])
            ->get();
        // Step 5: Load XML content (if exists)
        $filePath = "flows/{$flow->file_name}";
        $xmlContent = null;

        if (\Storage::disk('public')->exists($filePath)) {
            $xmlContent = \Storage::disk('public')->get($filePath);
        }

        // Step 5: Return combined data
        return response()->json([
            'flow' => [
                'id' => $flow->id,
                'title' => $flow->title,
                'description' => $flow->description,
                'node_data' => $flow->node_data,
                'file_name' => $flow->file_name,
                'created_at' => $flow->created_at,
                'xml' => $xmlContent, // ✅ added XML content

            ],
            'forms' => $formTemplates,
        ]);
    }

    // POST /api/form-templates
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $data = $request->input('form_data');

        // if it comes as JSON string, decode it
        if (is_string($data)) {
            $data = json_decode($data, true);
        }

        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid form_data format'], 422);
        }

        $title = $data['title'] ?? 'Untitled Form';

        $template = FormTemplate::create([
            'title' => $title,
            'form_data' => $data,
            'user_id' => $user->id, // 🆕 assign authenticated user
        ]);

        return response()->json($template, 201);
    }


    // GET /api/form-templates/{formTemplate}
    public function show(Request $request, FormTemplate $formTemplate)
    {
        if ($formTemplate->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        return response()->json($formTemplate);
    }

    // PUT /api/form-templates/{formTemplate}
    public function update(Request $request, FormTemplate $formTemplate)
    {
        if ($formTemplate->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'form_data' => 'required|array',
        ]);

        $title = $validated['form_data']['title'] ?? $formTemplate->title;

        $formTemplate->update([
            'title' => $title,
            'form_data' => $validated['form_data'],
        ]);

        return response()->json($formTemplate);
    }

    // DELETE /api/form-templates/{formTemplate}
    public function destroy(Request $request, FormTemplate $formTemplate)
    {
        if ($formTemplate->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        $formTemplate->delete();
        return response()->json(null, 204);
    }
}
