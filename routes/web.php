<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'transactions' => auth()->user()->transactions()->latest()->take(5)->get(),
        'investments' => auth()->user()->investments()->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // KYC Routes
    Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [\App\Http\Controllers\KycController::class, 'store'])->name('kyc.store');
    
    // Transaction Routes
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    
    // Admin Routes (Simplified check)
    Route::get('/admin/kyc', [\App\Http\Controllers\KycController::class, 'adminIndex'])->name('admin.kyc.index');
    Route::patch('/admin/kyc/{document}', [\App\Http\Controllers\KycController::class, 'updateStatus'])->name('admin.kyc.update');
});

require __DIR__.'/auth.php';
