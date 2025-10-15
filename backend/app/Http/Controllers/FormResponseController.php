<?php
namespace App\Http\Controllers;

use App\Models\FormResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

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
    public function downloadCsv(Request $request)
    {
        $request->validate([
            'flow_id' => 'required|exists:flows,id',
            'node_id' => 'required|string',
        ]);

        // Fetch all responses for given flow & node
        $responses = FormResponse::where('flow_id', $request->flow_id)
            ->where('node_id', $request->node_id)
            ->get();

        if ($responses->isEmpty()) {
            return response()->json(['message' => 'No responses found'], 404);
        }

        // // Make sure 'response' column is cast to array
        // $responses->transform(function ($item) {
        //     $item->response = json_decode($item->response, true) ?? [];
        //     return $item;
        // });

        // Extract all unique keys from all response arrays
        $allKeys = $responses->pluck('response')
            ->flatMap(fn($resp) => array_keys($resp))
            ->unique()
            ->values()
            ->toArray();

        // Prepare CSV header and rows
        $csvData = [];
        $csvData[] = $allKeys; // header

        foreach ($responses as $r) {
            $row = [];
            foreach ($allKeys as $key) {
                $row[] = $r->response[$key] ?? '';
            }
            $csvData[] = $row;
        }

        // Build CSV string
        $fileName = "form_responses_flow{$request->flow_id}_node{$request->node_id}.csv";
        $handle = fopen('php://temp', 'r+');
        foreach ($csvData as $line) {
            fputcsv($handle, $line);
        }
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
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
