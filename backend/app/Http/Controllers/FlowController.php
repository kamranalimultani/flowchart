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
    $user = $request->user(); // 🆕 get authenticated user
    if($user->subscription_type == "free_trial" && Flow::where("user_id", $user->id)->exists()) {}
    $request->validate([
      'title' => 'required|string|max:255',
      'type' => 'required|in:custom,upload',
      'file' => 'nullable|file|mimes:xml,drawio',
      'description' => 'nullable|string|max:1000',

    ]);



    // Generate unique file name
    $uniqueName = Str::uuid()->toString() . '.drawio';

    if ($request->type === 'custom') {
      // Default XML content for custom flows
      $defaultXml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" version="28.2.5">
  <diagram name="Page-1" id="WBuj-LygvqKu2Qh9Ulfa">
    <mxGraphModel dx="1240" dy="717" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="583" pageHeight="413" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="SGhFhDsp4yGYNef1wRKp-1" value="&lt;b&gt;&lt;font style=&quot;font-size: 29px;&quot;&gt;Welcome To FlowAnalytics&lt;/font&gt;&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="110" y="140" width="410" height="30" as="geometry" />
        </mxCell>
        <mxCell id="SGhFhDsp4yGYNef1wRKp-2" value="Powered By Melvok.cok" style="text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="147" y="177" width="290" height="30" as="geometry" />
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

  public function getFlowByFileName(Request $request, $fileName)
  {
    $user = $request->user();

    if (!$user) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    $flow = Flow::where('file_name', $fileName)->firstOrFail();

    if ($flow->user_id !== $user->id) {
      return response()->json(['error' => 'Forbidden'], 403);
    }

    return response()->json([
      'flow' => $flow
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
