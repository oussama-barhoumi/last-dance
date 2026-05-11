<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Branches/Index', [
            'branches' => Branch::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'address' => 'required|string',
            'available_slots' => 'required|array',
        ]);

        Branch::create($request->all());

        return back()->with('success', 'Branch protocol registered.');
    }
}
