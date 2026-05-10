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

    public function bulkStore(Request $request)
    {
        $request->validate([
            'budgets' => 'required|array',
            'budgets.*.name' => 'required|string',
            'budgets.*.amount' => 'required|numeric',
            'budgets.*.category' => 'required|string',
        ]);

        $user = $request->user();

        \DB::transaction(function () use ($user, $request) {
            // Optional: Clear existing budgets if user wants a clean slate
            $user->budgets()->delete();

            foreach ($request->budgets as $budgetData) {
                $user->budgets()->create($budgetData);
            }
        });

        return Redirect::back()->with('success', 'AI Budget Plan applied successfully!');
    }

    public function destroy(Budget $budget)
    {
        $this->authorize('delete', $budget);
        $budget->delete();

        return Redirect::back()->with('success', 'Budget activity deleted.');
    }
}
