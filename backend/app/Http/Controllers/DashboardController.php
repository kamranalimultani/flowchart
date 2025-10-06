<?php



namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Flow;
use App\Models\FormTemplate;
use App\Models\FormResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); // ✅ Authenticated user via Sanctum
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // =======================
        // 📊 Summary Metrics
        // =======================
        $totalUsers = User::count(); // or ->where('subscription_type', '!=', 'none')
        $totalFlows = Flow::where('user_id', $user->id)->count();
        $totalTemplates = FormTemplate::where('user_id', $user->id)->count();
        $totalSharedFlows = Flow::where('user_id', $user->id)
            ->whereNotNull('description') // simulate "shared"
            ->count();
        $totalSubmissions = FormResponse::where('user_id', $user->id)->count();
        $flowsCreated = Flow::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->count();

        // =======================
        // 📅 Bar Chart (Flows over last 4 months)
        // =======================
        $barData = Flow::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as flows')
        )
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subMonths(4))
            ->groupBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'flows' => $item->flows,
                ];
            });

        // If no data, add dummy months
        if ($barData->isEmpty()) {
            $barData = collect([
                ['name' => 'Jan', 'flows' => 2],
                ['name' => 'Feb', 'flows' => 4],
                ['name' => 'Mar', 'flows' => 3],
                ['name' => 'Apr', 'flows' => 5],
            ]);
        }

        // =======================
        // 📈 Line Chart (User growth dummy)
        // =======================
        $lineData = collect([
            ['name' => 'Week 1', 'users' => 1000],
            ['name' => 'Week 2', 'users' => 1200],
            ['name' => 'Week 3', 'users' => 1500],
            ['name' => 'Week 4', 'users' => 1700],
        ]);

        // =======================
        // 🥧 Pie Chart (Template Usage)
        // =======================
        $templateUsage = FormResponse::select(
            'form_template_id',
            DB::raw('COUNT(*) as total')
        )
            ->where('user_id', $user->id)
            ->groupBy('form_template_id')
            ->get()
            ->map(function ($item) {
                $template = FormTemplate::find($item->form_template_id);
                return [
                    'name' => $template?->title ?? 'Unknown',
                    'value' => $item->total,
                ];
            });

        // If no usage data, add dummy values
        if ($templateUsage->isEmpty()) {
            $templateUsage = collect([
                ['name' => 'Template A', 'value' => 400],
                ['name' => 'Template B', 'value' => 300],
                ['name' => 'Template C', 'value' => 300],
            ]);
        }

        // =======================
        // 🎯 Response
        // =======================
        return response()->json([
            'users' => $totalUsers,
            'flows' => $totalFlows,
            'templates' => $totalTemplates,
            'sharedFlows' => $totalSharedFlows,
            'submissions' => $totalSubmissions,
            'flowsCreated' => $flowsCreated,
            'barData' => $barData,
            'lineData' => $lineData,
            'pieData' => $templateUsage,
        ]);
    }
}

