<?php

namespace App\Http\Controllers;

use App\Models\Flow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class FlowController extends Controller
{
  // Store flow (custom or upload)
  public function store(Request $request)
  {
    $request->validate([
      'title' => 'required|string|max:255',
      'type' => 'required|in:custom,upload',
      'file' => 'nullable|file|mimes:xml,drawio',
      'description' => 'nullable|string|max:1000',

    ]);

    $user = $request->user(); // 🆕 get authenticated user


    // Generate unique file name
    $uniqueName = Str::uuid()->toString() . '.drawio';

    if ($request->type === 'custom') {
      // Default XML content for custom flows
      $defaultXml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" version="28.2.0">
  <diagram name="Page-1" id="L2mQjL2qGCYD0AGXEXjz">
    <mxGraphModel dx="1983" dy="956" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="850" pageHeight="1100" background="none" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="vK2hjZ5TibX_pdshGdGS-42" value="&lt;font style=&quot;font-size: 36px;&quot;&gt;&lt;b&gt;Welcome to Survey Flow&amp;nbsp;&lt;/b&gt;&lt;/font&gt;" style="text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="-750" y="-230" width="420" height="30" as="geometry" />
        </mxCell>
        <mxCell id="vK2hjZ5TibX_pdshGdGS-43" value="Powered By Melvok.com" style="text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="-650" y="-200" width="200" height="30" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
XML;

      Storage::disk('public')->put("flows/{$uniqueName}", $defaultXml);

    } elseif ($request->type === 'upload' && $request->hasFile('file')) {
      $request->file('file')->storeAs('flows', $uniqueName, 'public');
    } else {
      return response()->json(['error' => 'File is required for upload type'], 422);
    }

    // Save record
    $flow = Flow::create([
      'user_id' => $user->id, // 🆕 use authenticated user
      'title' => $request->title,
      'file_name' => $uniqueName,
      'description' => $request->description,
      'node_data' => null, // 🆕 by default, node_data is null

    ]);

    return response()->json([
      'message' => 'Flow created successfully',
      'flow' => $flow,
      'file_url' => Storage::url("flows/{$uniqueName}"),
    ]);
  }
  // Get all flows with xml content
  public function index(Request $request)
  {
    $user = $request->user(); // get authenticated user

    if (!$user) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    $flows = Flow::where('user_id', $user->id) // only flows of this user
      ->latest()
      ->get()->map(function ($flow) {
        $filePath = "flows/{$flow->file_name}";
        $xmlContent = null;

        if (Storage::disk('public')->exists($filePath)) {
          $xmlContent = Storage::disk('public')->get($filePath);
        }

        return [
          'id' => $flow->id,
          'title' => $flow->title,
          'file_name' => $flow->file_name,
          'file_url' => Storage::url($filePath),
          'xml' => $xmlContent,
          'description' => $flow->description,
          'node_data' => $flow->node_data, // 🆕 include node_data
          'created_at' => $flow->created_at,
          'updated_at' => $flow->updated_at,
        ];
      });

    return response()->json($flows);
  }
  public function update(Request $request, $id)
  {
    $request->validate([
      'title' => 'sometimes|string|max:255',
      'description' => 'sometimes|string|max:1000',
      'xml' => 'required|string', // updated XML content
      'node_data' => 'nullable|json', // 🆕 allow node_data update

    ]);

    $flow = Flow::findOrFail($id);
    $user = $request->user(); // get authenticated user
    if (!$user) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }
    // Update title/description if present
    if ($request->has('title')) {
      $flow->title = $request->title;
    }
    if ($request->has('description')) {
      $flow->description = $request->description;
    }
    if ($request->has('node_data'))
      $flow->node_data = $request->node_data; // 🆕

    // Find the file and overwrite its content
    $filePath = "flows/{$flow->file_name}";
    if (Storage::disk('public')->exists($filePath)) {
      Storage::disk('public')->put($filePath, $request->xml);
    } else {
      return response()->json(['error' => 'Flow file not found'], 404);
    }

    $flow->save();

    return response()->json([
      'message' => 'Flow updated successfully',
      'flow' => $flow,
      'file_url' => Storage::url($filePath),
    ]);
  }
  public function assignForm(Request $request, $id)
  {
    $user = $request->user(); // get authenticated user

    if (!$user) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    $flow = Flow::findOrFail($id);

    // Check if the authenticated user owns this flow
    if ($flow->user_id !== $user->id) {
      return response()->json(['error' => 'Forbidden'], 403);
    }
    if ($request->has('node_data'))
      $flow->node_data = $request->node_data; // 🆕
    $flow->save();

    return response()->json([
      'message' => 'Flow updated successfully',
      'flow' => $flow,
    ]);
  }
  public function destroy($id)
  {
    $flow = Flow::findOrFail($id);

    // Build the file path
    $filePath = "flows/{$flow->file_name}";

    // Delete file if exists
    if (Storage::disk('public')->exists($filePath)) {
      Storage::disk('public')->delete($filePath);
    }

    // Delete the database record
    $flow->delete();

    return response()->json([
      'message' => 'Flow deleted successfully',
    ]);
  }

}
