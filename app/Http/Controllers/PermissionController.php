<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('access-superadmin');

        $permissions = Permission::latest()
            ->paginate(15);

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Permission $permission): Response
    {
        Gate::authorize('access-superadmin');

        return Inertia::render('permissions/show', [
            'permission' => $permission,
        ]);
    }
}
