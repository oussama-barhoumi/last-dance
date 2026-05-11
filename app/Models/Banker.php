<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banker extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'specialization', 'active_loans_count', 'is_available'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'active_loans_count' => 'integer',
    ];

    public function loans()
    {
        return $this->hasMany(Loan::class, 'assigned_banker_id');
    }

    public function assignments()
    {
        return $this->hasMany(LoanAssignment::class);
    }
}
