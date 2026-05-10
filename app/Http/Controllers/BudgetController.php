<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class BudgetController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $request->user()->budgets()->create($request->all());

        return Redirect::back()->with('success', 'Budget activity created successfully.');
    }

    public function destroy(Budget $budget)
    {
        $this->authorize('delete', $budget);
        $budget->delete();

        return Redirect::back()->with('success', 'Budget activity deleted.');
    }
}
