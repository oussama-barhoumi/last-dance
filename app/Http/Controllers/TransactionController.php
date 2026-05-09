<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // In a real app, we'd use pagination and filters here.
        // For this demo, we'll fetch all and provide some realistic dummy data if empty.
        $transactions = $user->transactions()
            ->when($request->search, function($query, $search) {
                $query->where('description', 'like', "%{$search}%")
                      ->orWhere('transaction_id', 'like', "%{$search}%");
            })
            ->when($request->type, function($query, $type) {
                if ($type !== 'all') {
                    $query->where('type', $type);
                }
            })
            ->when($request->status, function($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'type', 'status']),
            'recentActivity' => $user->transactions()->latest()->take(5)->get(),
        ]);
    }
}
