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
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // KYC Routes
    Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [\App\Http\Controllers\KycController::class, 'store'])->name('kyc.store');
    
    // Transaction Routes
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions/send', [\App\Http\Controllers\TransactionController::class, 'sendMoney'])->name('transactions.send');
    Route::get('/transactions/export-csv', [\App\Http\Controllers\TransactionController::class, 'exportCsv'])->name('transactions.export-csv');
    Route::get('/transactions/download-statement', [\App\Http\Controllers\TransactionController::class, 'downloadStatement'])->name('transactions.download-statement');
    Route::get('/transactions/payment-methods', [\App\Http\Controllers\TransactionController::class, 'paymentMethods'])->name('transactions.payment-methods');
    Route::get('/transactions/recent-activity', [\App\Http\Controllers\TransactionController::class, 'recentActivity'])->name('transactions.recent-activity');

    // Account Routes
    Route::get('/accounts', [\App\Http\Controllers\AccountController::class, 'index'])->name('accounts.index');

    // Card Routes
    Route::get('/cards', [\App\Http\Controllers\CardController::class, 'index'])->name('cards.index');
    Route::get('/cards/request', [\App\Http\Controllers\CardController::class, 'create'])->name('cards.request');

    // Investment Routes
    Route::get('/investments', [\App\Http\Controllers\InvestmentController::class, 'index'])->name('investments.index');

    // Report Routes
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');

    // Settings Routes
    Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    
    // Admin Routes (Simplified check)
    Route::get('/admin/kyc', [\App\Http\Controllers\KycController::class, 'adminIndex'])->name('admin.kyc.index');
    Route::patch('/admin/kyc/{document}', [\App\Http\Controllers\KycController::class, 'updateStatus'])->name('admin.kyc.update');
});

require __DIR__.'/auth.php';
