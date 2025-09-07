<?php

// app/Http/Controllers/MockApiController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class MockApiController extends Controller
{
    // ✅ Create new mock endpoint
    public function create(Request $request)
    {
        $schema = $request->input('schema'); // JSON string
        $rows = $request->input('rows', 5);

        $decodedSchema = json_decode($schema, true);
        if (!$decodedSchema) {
            return response()->json(['error' => 'Invalid JSON schema'], 400);
        }

        $data = $this->generateDummyFromSchema($decodedSchema, $rows);

        $slug = Str::random(8);
        $expiresAt = Carbon::now()->addHours(24);

        Cache::put("mock:$slug", $data, $expiresAt);

        return response()->json([
            'endpoint' => url("/api/mock/$slug"),
            'expires_at' => $expiresAt
        ]);
    }

    // ✅ Fetch endpoint
    public function fetch($slug)
    {
        if (!Cache::has("mock:$slug")) {
            return response()->json(['error' => 'Endpoint expired or not found'], 404);
        }

        return response()->json(Cache::get("mock:$slug"));
    }

    // ✅ Recursive data generator
    private function generateDummyFromSchema($schema, $rows = 3)
    {
        if (is_string($schema)) {
            return $this->fakeValue($schema);
        }

        if (is_array($schema) && $this->isAssoc($schema)) {
            $obj = [];
            foreach ($schema as $key => $value) {
                $obj[$key] = $this->generateDummyFromSchema($value, $rows);
            }
            return $obj;
        }

        if (is_array($schema)) {
            $result = [];
            $template = $schema[0] ?? null;
            for ($i = 0; $i < $rows; $i++) {
                $result[] = $this->generateDummyFromSchema($template, $rows);
            }
            return $result;
        }

        return null;
    }

    private function isAssoc(array $arr)
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    private function fakeValue($type)
    {
        $type = strtolower(trim($type));

        // Pattern matching e.g. string-20, number-10-50
        if (preg_match('/^(string|number|email|name|bool)(?:-(\d+)(?:-(\d+))?)?$/', $type, $matches)) {
            $base = $matches[1];
            $arg1 = $matches[2] ?? null;
            $arg2 = $matches[3] ?? null;

            switch ($base) {
                case 'string':
                    $length = $arg1 ?? 10;
                    // Generate a sentence and trim to required length
                    $text = fake()->sentence(10);
                    return substr($text, 0, $length);

                case 'number':
                    if ($arg1 && $arg2) {
                        return rand((int) $arg1, (int) $arg2);
                    } elseif ($arg1) {
                        return rand(1, (int) $arg1);
                    }
                    return rand(1, 100);

                case 'email':
                    return fake()->unique()->safeEmail();

                case 'name':
                    return fake()->name();

                case 'bool':
                    return (bool) rand(0, 1);
            }
        }

        // ✅ Fallback (if mis-typed like "string-p")
        switch ($type) {
            case 'string':
                return fake()->sentence(3);
            case 'strings':
                return implode(' ', fake()->words(3));
            case 'number':
                return rand(1, 100);
            case 'email':
                return fake()->unique()->safeEmail();
            case 'name':
                return fake()->name();
            case 'bool':
                return (bool) rand(0, 1);
            default:
                return "dummy";
        }
    }

}

