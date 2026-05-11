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
    // Primary Entry Point: Role-based redirection or direct render
    Route::get('/dashboard', \App\Http\Controllers\RoleRedirectController::class)->name('dashboard');

    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
        
        Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'adminIndex'])->name('kyc.index');
        Route::patch('/kyc/{document}', [\App\Http\Controllers\KycController::class, 'updateStatus'])->name('kyc.update');
    });

    // Shared Admin/Super Admin Features
    Route::middleware(['admin'])->group(function () {
        Route::get('/super-admin/users', [\App\Http\Controllers\UserController::class, 'index'])->name('super-admin.users.index');
        Route::patch('/super-admin/users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('super-admin.users.update');
        Route::delete('/super-admin/users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('super-admin.users.destroy');
        Route::post('/super-admin/users/{user}/toggle-block', [\App\Http\Controllers\UserController::class, 'toggleBlock'])->name('super-admin.users.toggle-block');
        Route::post('/super-admin/users/{user}/toggle-active', [\App\Http\Controllers\UserController::class, 'toggleActive'])->name('super-admin.users.toggle-active');
        
        Route::get('/super-admin/transactions', [\App\Http\Controllers\SuperAdminController::class, 'transactions'])->name('super-admin.transactions.index');
    });

    // Super Admin Exclusive Routes
    Route::middleware(['super-admin'])->prefix('super-admin')->name('super-admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SuperAdminController::class, 'index'])->name('dashboard');
        Route::get('/admins', [\App\Http\Controllers\SuperAdminController::class, 'manageAdmins'])->name('admins.index');
        Route::get('/analytics', [\App\Http\Controllers\SuperAdminController::class, 'analytics'])->name('analytics.index');
        Route::get('/loans', [\App\Http\Controllers\SuperAdminController::class, 'loans'])->name('loans.index');
        Route::get('/settings', [\App\Http\Controllers\SuperAdminController::class, 'settings'])->name('settings.index');
        Route::get('/fraud', [\App\Http\Controllers\SuperAdminController::class, 'fraud'])->name('fraud.index');
        Route::get('/logs', [\App\Http\Controllers\SuperAdminController::class, 'logs'])->name('logs.index');
        Route::get('/ai-monitoring', [\App\Http\Controllers\SuperAdminController::class, 'aiMonitoring'])->name('ai-monitoring.index');
        Route::get('/reports', [\App\Http\Controllers\SuperAdminController::class, 'reports'])->name('reports.index');
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
    Route::get('/transactions/payment-methods', [\App\Http\Controllers\TransactionController::class, 'paymentMethods'])->name('transactions.payment-methods');
    Route::get('/transactions/recent-activity', [\App\Http\Controllers\TransactionController::class, 'recentActivity'])->name('transactions.recent-activity');

    Route::get('/accounts', [\App\Http\Controllers\AccountController::class, 'index'])->name('accounts.index');

    Route::get('/cards', [\App\Http\Controllers\CardController::class, 'index'])->name('cards.index');
    Route::get('/cards/request', [\App\Http\Controllers\CardController::class, 'create'])->name('cards.request');

    Route::get('/investments', [\App\Http\Controllers\InvestmentController::class, 'index'])->name('investments.index');

    Route::get('/loans', [\App\Http\Controllers\LoanController::class, 'index'])->name('loans.index');
    Route::get('/loans/apply', [\App\Http\Controllers\LoanController::class, 'apply'])->name('loans.apply');
    Route::post('/loans', [\App\Http\Controllers\LoanController::class, 'store'])->name('loans.store');
    Route::post('/loans/pay-emi', [\App\Http\Controllers\LoanController::class, 'payEmi'])->name('loans.pay');

    Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');

    // KYC Routes (User)
    Route::get('/kyc', [\App\Http\Controllers\KycController::class, 'index'])->name('kyc.index');
    Route::post('/kyc', [\App\Http\Controllers\KycController::class, 'store'])->name('kyc.store');

    // Trading Routes
    Route::get('/stocks/{symbol}', [\App\Http\Controllers\TradeController::class, 'getQuote'])->name('stocks.quote');
    Route::post('/trade/buy', [\App\Http\Controllers\TradeController::class, 'buy'])->name('trade.buy');
    Route::post('/trade/sell', [\App\Http\Controllers\TradeController::class, 'sell'])->name('trade.sell');

    // AI & Voice Assistant Routes
    Route::get('/ai-assistant', [\App\Http\Controllers\AiAssistantController::class, 'index'])->name('ai-assistant.index');
    Route::get('/voice-coach', [\App\Http\Controllers\VoiceCoachController::class, 'index'])->name('voice-coach.index');
    Route::post('/voice-coach/ask', [\App\Http\Controllers\VoiceCoachController::class, 'ask'])->name('voice-coach.ask');
    Route::get('/voice-call', [\App\Http\Controllers\VoiceCallController::class, 'index'])->name('voice-call.index');
    Route::post('/voice-call/process', [\App\Http\Controllers\VoiceCallController::class, 'process'])->name('voice-call.process');

    // Budget Routes
    Route::post('/budgets', [\App\Http\Controllers\BudgetController::class, 'store'])->name('budgets.store');
    Route::post('/budgets/bulk', [\App\Http\Controllers\BudgetController::class, 'bulkStore'])->name('budgets.bulk-store');
    Route::delete('/budgets/{budget}', [\App\Http\Controllers\BudgetController::class, 'destroy'])->name('budgets.destroy');

    // Notification Routes
    Route::post('/notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');

    // Utility Routes
    Route::get('/users/lookup', function (Request $request) {
        return \App\Models\User::where('email', $request->email)->firstOrFail();
    })->name('users.lookup');
});

require __DIR__ . '/auth.php';
