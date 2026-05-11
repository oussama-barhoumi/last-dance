<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanAssignment extends Model
{
    protected $fillable = [
        'loan_id', 'banker_id', 'assigned_at', 'meeting_scheduled_at', 'contact_details'
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'meeting_scheduled_at' => 'datetime',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function banker()
    {
        return $this->belongsTo(Banker::class);
    }
}
