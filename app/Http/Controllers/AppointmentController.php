<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Branch;
use App\Models\Appointment;
use App\Services\LoanApprovalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AppointmentController extends Controller
{
    protected $loanApprovalService;

    public function __construct(LoanApprovalService $loanApprovalService)
    {
        $this->loanApprovalService = $loanApprovalService;
    }

    /**
     * Show the booking page for a specific loan.
     */
    public function book(Loan $loan)
    {
        if ($loan->status !== 'approved_pending_booking') {
            return redirect()->route('loans.index')->with('error', 'Booking is only allowed for approved loans.');
        }

        return Inertia::render('Loans/Booking', [
            'loan' => $loan,
            'branches' => Branch::where('is_active', true)->get(),
        ]);
    }

    /**
     * Store a new appointment.
     */
    public function store(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'branch_id' => 'required|exists:branches,id',
            'date' => 'required|date|after:today',
            'time_slot' => 'required|string',
            'purpose' => 'required|string',
        ]);

        $loan = Loan::findOrFail($request->loan_id);

        // Check if slot is already taken
        $exists = Appointment::where('branch_id', $request->branch_id)
            ->where('appointment_date', $request->date)
            ->where('time_slot', $request->time_slot)
            ->exists();

        if ($exists) {
            return back()->withErrors(['time_slot' => 'This time slot is already booked. Please select another.']);
        }

        Appointment::create([
            'user_id' => auth()->id(),
            'loan_id' => $loan->id,
            'branch_id' => $request->branch_id,
            'appointment_date' => $request->date,
            'time_slot' => $request->time_slot,
            'purpose' => $request->purpose,
            'status' => 'pending',
        ]);

        $loan->update(['status' => 'appointment_scheduled']);

        return redirect()->route('loans.index')->with('success', 'Appointment scheduled successfully. Our team will verify your identity on-site.');
    }

    /**
     * Admin: List all appointments.
     */
    public function adminIndex()
    {
        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => Appointment::with(['user', 'loan', 'branch'])->latest()->get()
        ]);
    }

    /**
     * Admin: Complete an appointment and finalize the loan.
     */
    public function complete(Appointment $appointment)
    {
        $appointment->update(['status' => 'completed']);
        
        $loan = $appointment->loan;
        $this->loanApprovalService->finalize($loan);

        return Redirect::back()->with('success', 'Appointment completed. Loan protocol finalized and funds disbursed.');
    }

    /**
     * Admin: Confirm an appointment.
     */
    public function confirm(Appointment $appointment)
    {
        $appointment->update(['status' => 'confirmed']);
        return Redirect::back()->with('success', 'Appointment confirmed.');
    }
}
