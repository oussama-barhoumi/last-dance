<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function index()
    {
        return Inertia::render('Loans/Index', [
            'stats' => [
                'total_balance' => 125400,
                'monthly_payment' => 2450,
                'remaining_amount' => 84200,
                'loan_score' => 785
            ],
            'activeLoans' => [
                [
                    'id' => 1,
                    'type' => 'Home Loan',
                    'provider' => 'HarborBank',
                    'amount' => 250000,
                    'rate' => '3.5%',
                    'duration' => '20 Years',
                    'monthly' => 1450,
                    'status' => 'approved',
                    'progress' => 45
                ],
                [
                    'id' => 2,
                    'type' => 'Car Loan',
                    'provider' => 'AutoFinance',
                    'amount' => 35000,
                    'rate' => '5.2%',
                    'duration' => '5 Years',
                    'monthly' => 650,
                    'status' => 'pending',
                    'progress' => 12
                ],
                [
                    'id' => 3,
                    'type' => 'Business Loan',
                    'provider' => 'HarborBank',
                    'amount' => 50000,
                    'rate' => '4.8%',
                    'duration' => '10 Years',
                    'monthly' => 550,
                    'status' => 'approved',
                    'progress' => 68
                ],
                [
                    'id' => 4,
                    'type' => 'Student Loan',
                    'provider' => 'EduFund',
                    'amount' => 15000,
                    'rate' => '2.1%',
                    'duration' => '15 Years',
                    'monthly' => 120,
                    'status' => 'overdue',
                    'progress' => 85
                ]
            ],
            'recentTransactions' => [
                ['id' => 1, 'description' => 'Home Loan EMI', 'amount' => 1450, 'type' => 'debit', 'date' => '2 hours ago', 'status' => 'completed'],
                ['id' => 2, 'description' => 'Business Loan Refund', 'amount' => 250, 'type' => 'credit', 'date' => '1 day ago', 'status' => 'completed'],
                ['id' => 3, 'description' => 'Car Loan Penalty', 'amount' => 45, 'type' => 'debit', 'date' => '3 days ago', 'status' => 'failed'],
            ]
        ]);
    }
    public function apply()
    {
        return Inertia::render('Loans/Apply', [
            'user' => auth()->user()
        ]);
    }
}
