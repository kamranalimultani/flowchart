<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    // Public: List published blogs
    public function index(Request $request)
    {
        $query = Blog::with('author')->where('is_published', true);

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('per_page', 10);
        return response()->json($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    // Public: Show single blog
    public function show($slug)
    {
        $blog = Blog::with('author')->where('slug', $slug)->where('is_published', true)->firstOrFail();
        
        // Related blogs logic (e.g., random or same author) - for now random/latest excluding current
        $related = Blog::where('id', '!=', $blog->id)
            ->where('is_published', true)
            ->inRandomOrder()
            ->take(3)
            ->get();

        return response()->json([
            'blog' => $blog,
            'related' => $related
        ]);
    }

    // Admin: List all blogs
    public function adminIndex(Request $request)
    {
        // Permission check is done via middleware/route group, assuming admin access here
        $query = Blog::with('author');

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(10));
    }

    // Admin: Show single blog (by ID)
    public function adminShow($id)
    {
        return response()->json(Blog::findOrFail($id));
    }

    // Admin: Create
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'image' => 'nullable|string', // URL or base64 usually
            'is_published' => 'boolean'
        ]);

        $slug = Str::slug($validated['title']) . '-' . Str::random(6);

        $blog = Blog::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $validated['content'],
            'excerpt' => $validated['excerpt'],
            'image' => $validated['image'],
            'is_published' => $validated['is_published'] ?? false,
            'user_id' => Auth::id() // Current admin user
        ]);

        return response()->json($blog, 201);
    }

    // Admin: Update
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'excerpt' => 'nullable|string',
            'image' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        if (isset($validated['title']) && $validated['title'] !== $blog->title) {
             $blog->slug = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        $blog->update($validated);

        return response()->json($blog);
    }

    // Admin: Delete
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();
        return response()->json(['message' => 'Blog deleted successfully']);
    }
}
