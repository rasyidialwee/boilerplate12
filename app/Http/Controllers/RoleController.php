<?php

namespace App\Http\Controllers;

use App\Actions\Roles\CreateRole;
use App\Actions\Roles\DeleteRole;
use App\Actions\Roles\UpdateRole;
use App\Http\Requests\Roles\StoreRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('access-superadmin');

        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100]) ? (int) $perPage : 10;

        $roles = QueryBuilder::for(Role::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    return $query->where('name', 'like', "%{$value}%")
                        ->orWhere('guard_name', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['name', 'guard_name', 'created_at'])
            ->allowedIncludes(['permissions'])
            ->defaultSort('-created_at')
            ->with('permissions')
            ->withCount('permissions')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('access-superadmin');

        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('roles/form', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request, CreateRole $createRole): RedirectResponse
    {
        Gate::authorize('access-superadmin');

        $createRole->handle($request->validated());

        return redirect()->route('roles.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Role $role): Response
    {
        Gate::authorize('access-superadmin');

        $role->load('permissions');

        return Inertia::render('roles/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Role $role): Response
    {
        Gate::authorize('access-superadmin');

        $role->load('permissions');
        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('roles/form', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role, UpdateRole $updateRole): RedirectResponse
    {
        Gate::authorize('access-superadmin');

        $updateRole->handle($role, $request->validated());

        return redirect()->route('roles.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role, DeleteRole $deleteRole): RedirectResponse
    {
        Gate::authorize('access-superadmin');

        $deleteRole->handle($role);

        return redirect()->route('roles.index');
    }
}
