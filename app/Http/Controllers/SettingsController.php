<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Settings/Index', [
            'user' => $user,
            'sessions' => [
                ['id' => 1, 'device' => 'iPhone 15 Pro', 'location' => 'Casablanca, MA', 'status' => 'Current Session', 'last_active' => 'Now'],
                ['id' => 2, 'device' => 'MacBook Pro 16"', 'location' => 'Rabat, MA', 'status' => 'Active', 'last_active' => '2 hours ago'],
            ],
            'beneficiaries' => [
                ['id' => 1, 'name' => 'Ahmed Alaoui', 'bank' => 'Attijariwafa Bank', 'account' => '...4567'],
                ['id' => 2, 'name' => 'Fatima Zahra', 'bank' => 'BMCE Bank', 'account' => '...8912'],
            ]
        ]);
    }
}
