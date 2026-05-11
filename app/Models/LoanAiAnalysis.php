<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanAiAnalysis extends Model
{
    protected $fillable = [
        'loan_id', 'risk_score', 'risk_level', 'can_afford', 
        'debt_to_income_ratio', 'reasoning', 'summary_feedback', 'recommendation'
    ];

    protected $casts = [
        'reasoning' => 'array',
        'can_afford' => 'boolean',
        'debt_to_income_ratio' => 'float',
        'risk_score' => 'integer',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
