<?php

namespace App\Http\Controllers;

use App\Models\FlowTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Str;

class FlowTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FlowTemplate::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
        }

        $templates = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'xml_file' => 'required|file|mimes:xml,text', // Ensure XML or text file
            'thumbnail' => 'nullable|image|max:2048', // Max 2MB image
            'tags' => 'nullable|string', // JSON string or comma separated
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $xmlPath = $request->file('xml_file')->store('flow-templates/xml', 'public');
        
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('flow-templates/thumbnails', 'public');
        }

        // Handle tags: assume frontend sends array or comma-separated string
        $tags = $request->input('tags');
        if (is_string($tags)) {
             // Try to decode if JSON, else explode
             $decoded = json_decode($tags, true);
             $tags = is_array($decoded) ? $decoded : explode(',', $tags);
        }

        // Generate slug
        $slug = Str::slug($request->title);
        // Ensure uniqueness (simple counter implementation)
        $count = FlowTemplate::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        $template = FlowTemplate::create([
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'xml_file_path' => $xmlPath,
            'thumbnail_path' => $thumbnailPath,
            'tags' => $tags,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Flow template created successfully',
            'data' => $template,
        ], 201);
    }

    /**
     * Display the specified resource by slug.
     */
    public function showBySlug($slug)
    {
        $template = FlowTemplate::where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $template,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $template = FlowTemplate::find($id);

        if (!$template) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $template]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $template = FlowTemplate::find($id);

        if (!$template) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'xml_file' => 'nullable|file|mimes:xml,text',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($request->hasFile('xml_file')) {
            // Delete old file
            Storage::disk('public')->delete($template->xml_file_path);
            $template->xml_file_path = $request->file('xml_file')->store('flow-templates/xml', 'public');
        }

        if ($request->hasFile('thumbnail')) {
            if ($template->thumbnail_path) {
                Storage::disk('public')->delete($template->thumbnail_path);
            }
            $template->thumbnail_path = $request->file('thumbnail')->store('flow-templates/thumbnails', 'public');
        }

        if ($request->has('tags')) {
            $tags = $request->input('tags');
            if (is_string($tags)) {
                 $decoded = json_decode($tags, true);
                 $tags = is_array($decoded) ? $decoded : explode(',', $tags);
            }
            $template->tag = $tags; // Typical typo fix if necessary, or ensure tags are saved correctly
            $template->tags = $tags;
        }

        if ($request->has('title') && $request->title !== $template->title) {
            $slug = Str::slug($request->title);
            $count = FlowTemplate::where('slug', $slug)->where('id', '!=', $id)->count();
            if ($count > 0) {
                $slug = $slug . '-' . ($count + 1);
            }
            $template->slug = $slug;
        }

        $template->fill($request->only(['title', 'description']));
        $template->save();

        return response()->json([
            'success' => true,
            'message' => 'Flow template updated successfully',
            'data' => $template,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $template = FlowTemplate::find($id);

        if (!$template) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        // Delete files
        Storage::disk('public')->delete($template->xml_file_path);
        if ($template->thumbnail_path) {
            Storage::disk('public')->delete($template->thumbnail_path);
        }

        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'Flow template deleted successfully',
        ]);
    }
}
