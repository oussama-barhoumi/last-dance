<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'type' => 'nullable|in:all,debit,credit,transfer,payment',
            'status' => 'nullable|in:all,completed,pending,failed,cancelled',
            'sort_by' => 'nullable|in:transaction_id,description,type,amount,status,transaction_date',
            'sort_order' => 'nullable|in:asc,desc',
        ]);

        $query = Transaction::forUser(auth()->id())
            ->search($request->search)
            ->filterByType($request->type)
            ->filterByStatus($request->status)
            ->sortBy($request->sort_by ?? 'transaction_date', $request->sort_order ?? 'desc');

        $transactions = $query->paginate(10)->through(fn ($tx) => [
            'id' => $tx->id,
            'transaction_id' => $tx->transaction_id,
            'description' => $tx->description,
            'type' => $tx->type,
            'amount' => number_format($tx->amount, 2, '.', ''),
            'status' => $tx->status,
            'date' => $tx->transaction_date->format('M d, Y'),
            'payment_method' => $tx->payment_method,
        ]);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'type', 'status', 'sort_by', 'sort_order']),
            'paymentMethods' => $this->getPaymentMethodStats(),
            'recentActivity' => $this->getRecentActivityData(),
            'stats' => [
                'total_count' => Transaction::forUser(auth()->id())->count(),
            ]
        ]);
    }

    public function exportCsv(Request $request)
    {
        $transactions = Transaction::forUser(auth()->id())
            ->search($request->search)
            ->filterByType($request->type)
            ->filterByStatus($request->status)
            ->sortBy($request->sort_by ?? 'transaction_date', $request->sort_order ?? 'desc')
            ->get();

        $filename = "transactions-" . date('Y-m-d') . ".csv";
        
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($transactions) {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM for Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, ['Transaction ID', 'Description', 'Type', 'Amount', 'Status', 'Payment Method', 'Date', 'Notes']);

            foreach ($transactions as $tx) {
                fputcsv($file, [
                    $tx->transaction_id,
                    $tx->description,
                    ucfirst($tx->type),
                    $tx->amount,
                    ucfirst($tx->status),
                    str_replace('_', ' ', ucfirst($tx->payment_method)),
                    $tx->transaction_date->format('Y-m-d H:i:s'),
                    $tx->notes
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function downloadStatement(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->subMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : now();

        $transactions = Transaction::forUser(auth()->id())
            ->whereBetween('transaction_date', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->orderBy('transaction_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.statement', [
            'user' => auth()->user(),
            'transactions' => $transactions,
            'startDate' => $startDate->format('M d, Y'),
            'endDate' => $endDate->format('M d, Y'),
            'generatedDate' => now()->format('M d, Y H:i'),
        ]);

        return $pdf->download('statement-' . date('Y-m-d') . '.pdf');
    }

    public function paymentMethods()
    {
        return response()->json($this->getPaymentMethodStats());
    }

    public function recentActivity()
    {
        return response()->json($this->getRecentActivityData());
    }

    private function getPaymentMethodStats()
    {
        $total = Transaction::forUser(auth()->id())->count();
        if ($total === 0) return [];

        $methods = Transaction::forUser(auth()->id())
            ->selectRaw('payment_method as key, count(*) as count')
            ->groupBy('payment_method')
            ->get();

        $labels = [
            'credit_card' => 'Credit Card',
            'bank_transfer' => 'Bank Transfer',
            'cash' => 'Cash',
            'digital_wallet' => 'Digital Wallet',
        ];

        return $methods->map(fn ($m) => [
            'method' => $labels[$m->key] ?? ucfirst(str_replace('_', ' ', $m->key)),
            'key' => $m->key,
            'count' => $m->count,
            'percentage' => round(($m->count / $total) * 100),
        ]);
    }

    private function getRecentActivityData()
    {
        return Transaction::forUser(auth()->id())
            ->orderBy('transaction_date', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($tx) => [
                'id' => $tx->id,
                'transaction_id' => $tx->transaction_id,
                'description' => $tx->description,
                'type' => $tx->type,
                'amount' => number_format($tx->amount, 2, '.', ''),
                'status' => $tx->status,
                'date' => $tx->transaction_date->diffForHumans(),
                'payment_method' => $tx->payment_method,
            ]);
    }
}
