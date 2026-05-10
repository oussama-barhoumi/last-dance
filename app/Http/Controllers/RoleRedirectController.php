<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class RoleRedirectController extends Controller
{
    public function __invoke(Request $request)
    {
        $role = $request->user()->role;

        if ($role === 'super_admin') {
            return Redirect::route('super-admin.dashboard');
        }

        if ($role === 'admin') {
            return Redirect::route('admin.dashboard');
        }

        // Standard User: Render directly to avoid redirect loops
        return \Inertia\Inertia::render('Dashboard', [
            'transactions' => $request->user()->transactions()->latest()->take(5)->get(),
            'investments' => $request->user()->investments()->get(),
            'budgets' => $request->user()->budgets()->get(),
        ]);
    }
}
