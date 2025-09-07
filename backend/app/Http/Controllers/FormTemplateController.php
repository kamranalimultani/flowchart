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
        $query = FormTemplate::query()->select(['id', 'title', 'form_data', 'created_at']);

        // optional search ?q=login
        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'like', "%{$q}%");
        }

        return response()->json($query->paginate($perPage));
    }

    // POST /api/form-templates
    public function store(Request $request)
    {
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
        ]);

        return response()->json($template, 201);
    }


    // GET /api/form-templates/{formTemplate}
    public function show(FormTemplate $formTemplate)
    {
        return response()->json($formTemplate);
    }

    // PUT /api/form-templates/{formTemplate}
    public function update(Request $request, FormTemplate $formTemplate)
    {
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
    public function destroy(FormTemplate $formTemplate)
    {
        $formTemplate->delete();
        return response()->json(null, 204);
    }
}
