<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class RoleRedirectController extends Controller
{
    public function __invoke(Request $request)
    {
        $role = $request->user()->role;

        return match ($role) {
            'super_admin' => Redirect::route('super-admin.dashboard'),
            'admin'       => Redirect::route('admin.dashboard'),
            default       => Redirect::route('dashboard'),
        };
    }
}
