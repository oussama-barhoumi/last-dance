<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'user_id', 'type', 'provider', 'amount', 'remaining_amount', 
        'interest_rate', 'duration', 'monthly_payment', 'status', 
        'progress', 'purpose', 'risk_score', 'financial_snapshot',
        'income', 'expenses', 'job_type', 'admin_notes', 'assigned_banker_id'
    ];

    protected $casts = [
        'financial_snapshot' => 'array',
        'risk_score' => 'integer',
        'amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'monthly_payment' => 'decimal:2',
        'income' => 'decimal:2',
        'expenses' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aiAnalysis()
    {
        return $this->hasOne(LoanAiAnalysis::class);
    }

    public function repayments()
    {
        return $this->hasMany(LoanRepayment::class);
    }

    public function assignment()
    {
        return $this->hasOne(LoanAssignment::class);
    }

    public function banker()
    {
        return $this->belongsTo(Banker::class, 'assigned_banker_id');
    }
}
