<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based redirection entry point
    Route::get('/dashboard', \App\Http\Controllers\RoleRedirectController::class)->name('dashboard');

    // Standard User Routes
    Route::get('/user/dashboard', function () {
        return Inertia::render('Dashboard', [
            'transactions' => auth()->user()->transactions()->latest()->take(5)->get(),
            'investments' => auth()->user()->investments()->get(),
            'budgets' => auth()->user()->budgets()->get(),
        ]);
    })->name('user.dashboard');

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'total_users' => \App\Models\User::count(),
                    'pending_kyc' => \App\Models\KycDocument::where('status', 'pending')->count(),
                    'total_loans' => \App\Models\Loan::count(),
                ]
            ]);
        })->name('dashboard');
        
        Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'adminIndex'])->name('kyc.index');
        Route::patch('/kyc/{document}', [\App\Http\Controllers\KycController::class, 'updateStatus'])->name('kyc.update');
    });

    // Super Admin Routes
    Route::middleware(['super-admin'])->prefix('super-admin')->name('super-admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SuperAdminController::class, 'index'])->name('dashboard');
        Route::post('/users/{user}/toggle-block', [\App\Http\Controllers\SuperAdminController::class, 'toggleBlock'])->name('users.toggle-block');
    });

    // Shared Auth Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Banking Features (Accessible by all authenticated users)
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions/send', [\App\Http\Controllers\TransactionController::class, 'sendMoney'])->name('transactions.send');
    Route::get('/transactions/export-csv', [\App\Http\Controllers\TransactionController::class, 'exportCsv'])->name('transactions.export-csv');
    Route::get('/transactions/download-statement', [\App\Http\Controllers\TransactionController::class, 'downloadStatement'])->name('transactions.download-statement');

    Route::get('/accounts', [\App\Http\Controllers\AccountController::class, 'index'])->name('accounts.index');
    Route::get('/cards', [\App\Http\Controllers\CardController::class, 'index'])->name('cards.index');
    Route::get('/investments', [\App\Http\Controllers\InvestmentController::class, 'index'])->name('investments.index');
    Route::get('/loans', [\App\Http\Controllers\LoanController::class, 'index'])->name('loans.index');
    Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
});

require __DIR__ . '/auth.php';
