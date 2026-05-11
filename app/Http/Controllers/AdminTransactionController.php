<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['sender', 'receiver', 'user']);

        // 1. Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('transaction_id', 'like', "%{$request->search}%")
                  ->orWhere('reference', 'like', "%{$request->search}%")
                  ->orWhereHas('sender', function($sub) use ($request) {
                      $sub->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%");
                  })
                  ->orWhereHas('receiver', function($sub) use ($request) {
                      $sub->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%");
                  });
            });
        }

        // 2. Advanced Filters
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->min_amount) {
            $query->where('amount', '>=', $request->min_amount);
        }

        if ($request->max_amount) {
            $query->where('amount', '<=', $request->max_amount);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // 3. Risk Flagging (Simulated/Calculated)
        $transactions = $query->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function ($tx) {
                $tx->risk_level = $this->calculateRisk($tx);
                return $tx;
            });

        // 4. Analytics Data
        $analytics = [
            'total_volume' => Transaction::sum('amount'),
            'volume_over_time' => Transaction::select(
                DB::raw("strftime('%m-%d', created_at) as date"),
                DB::raw('SUM(amount) as total')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->get(),
            'type_distribution' => Transaction::select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get(),
        ];

        return Inertia::render('SuperAdmin/Transactions', [
            'transactions' => $transactions,
            'analytics' => $analytics,
            'filters' => $request->only(['search', 'status', 'type', 'min_amount', 'max_amount', 'date_from', 'date_to']),
        ]);
    }

    private function calculateRisk($tx)
    {
        $risk = 0;
        
        // Rule 1: High Amount
        if ($tx->amount > 50000) $risk += 50;
        if ($tx->amount > 10000) $risk += 20;

        // Rule 2: Suspicious Type (Simulated)
        if ($tx->type === 'withdrawal' && $tx->amount > 5000) $risk += 15;

        // Rule 3: Rapid Succession (Example)
        $recentCount = Transaction::where('sender_id', $tx->sender_id)
            ->where('created_at', '>=', $tx->created_at->subMinutes(5))
            ->count();
        if ($recentCount > 3) $risk += 30;

        if ($risk >= 70) return 'critical';
        if ($risk >= 40) return 'high';
        if ($risk >= 20) return 'medium';
        return 'low';
    }

    public function exportCsv(Request $request)
    {
        $fileName = 'transactions_' . now()->format('Ymd_His') . '.csv';
        $transactions = Transaction::with(['sender', 'receiver'])->latest()->get();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('ID', 'Date', 'Sender', 'Receiver', 'Amount', 'Currency', 'Type', 'Status');

        $callback = function() use($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($transactions as $tx) {
                fputcsv($file, array(
                    $tx->transaction_id,
                    $tx->created_at,
                    $tx->sender?->name ?? 'SYSTEM',
                    $tx->receiver?->name ?? $tx->user?->name,
                    $tx->amount,
                    $tx->currency,
                    $tx->type,
                    $tx->status
                ));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
