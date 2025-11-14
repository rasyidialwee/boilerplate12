<?php

namespace App\Http\Controllers;

use App\Actions\Users\AssignRoleToUser;
use App\Actions\Users\CreateUser;
use App\Actions\Users\DeleteUser;
use App\Actions\Users\UpdateUser;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100]) ? (int) $perPage : 10;

        $users = QueryBuilder::for(User::class)
            ->allowedFilters([
                AllowedFilter::scope('search'),
                AllowedFilter::exact('role', 'roles.name'),
            ])
            ->allowedSorts(['name', 'email', 'created_at'])
            ->allowedIncludes(['roles'])
            ->defaultSort('-created_at')
            ->with('roles')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', User::class);

        $roles = Role::orderBy('name')->get();

        return Inertia::render('users/form', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request, CreateUser $createUser): RedirectResponse
    {
        Gate::authorize('create', User::class);

        $createUser->handle($request->validated());

        return redirect()->route('users.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, User $user): Response
    {
        Gate::authorize('update', $user);

        $user->load('roles');
        $roles = Role::orderBy('name')->get();

        return Inertia::render('users/form', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user, UpdateUser $updateUser, AssignRoleToUser $assignRoleToUser): RedirectResponse
    {
        Gate::authorize('update', $user);

        $updateUser->handle($user, $request->validated());
        $assignRoleToUser->handle($user, $request->validated()['role']);

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user, DeleteUser $deleteUser): RedirectResponse
    {
        Gate::authorize('delete', $user);

        // Additional safety check: prevent users from deleting their own account
        if ($request->user()->id === $user->id) {
            return redirect()->route('users.index')
                ->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $deleteUser->handle($user);

        return redirect()->route('users.index');
    }
}
