<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

test('guests cannot view activity logs', function () {
    $this->get(route('activity-logs.index'))->assertRedirect(route('login'));
});

test('regular users cannot view activity logs', function () {
    $user = User::factory()->create();
    $userRole = Role::firstOrCreate(['name' => 'user']);
    $user->assignRole($userRole);

    $this->actingAs($user)
        ->get(route('activity-logs.index'))
        ->assertForbidden();
});

test('admin users can view activity logs', function () {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $admin->assignRole($adminRole);

    $this->actingAs($admin)
        ->get(route('activity-logs.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/index')
            ->has('activityLogs')
        );
});

test('superadmin users can view activity logs', function () {
    $this->actingAs(createSuperAdmin())
        ->get(route('activity-logs.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/index')
            ->has('activityLogs')
        );
});

test('admin users can view individual activity log', function () {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $admin->assignRole($adminRole);

    $user = User::factory()->create();
    $activity = Activity::create([
        'log_name' => 'default',
        'description' => 'Created User',
        'subject_type' => User::class,
        'subject_id' => $user->id,
        'causer_type' => User::class,
        'causer_id' => $admin->id,
        'event' => 'created',
        'properties' => [],
    ]);

    $this->actingAs($admin)
        ->get(route('activity-logs.show', $activity))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/show')
            ->has('activityLog')
        );
});

test('user model changes are logged', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    // Check that creation was logged
    $this->assertDatabaseHas('activity_log', [
        'subject_type' => User::class,
        'subject_id' => $user->id,
        'event' => 'created',
    ]);

    // Update user
    $user->update(['name' => 'Updated Name']);

    // Check that update was logged
    $this->assertDatabaseHas('activity_log', [
        'subject_type' => User::class,
        'subject_id' => $user->id,
        'event' => 'updated',
    ]);

    // Delete user
    $user->delete();

    // Check that deletion was logged
    $this->assertDatabaseHas('activity_log', [
        'subject_type' => User::class,
        'subject_id' => $user->id,
        'event' => 'deleted',
    ]);
});

test('activity logs can be filtered by event', function () {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $admin->assignRole($adminRole);

    $user = User::factory()->create();
    $user->update(['name' => 'Updated Name']);

    $this->actingAs($admin)
        ->get(route('activity-logs.index', ['filter' => ['event' => 'updated']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/index')
            ->has('activityLogs.data')
        );
});

test('activity logs can be filtered by subject type', function () {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $admin->assignRole($adminRole);

    $user = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('activity-logs.index', ['filter' => ['subject_type' => User::class]]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/index')
            ->has('activityLogs.data')
        );
});

test('activity logs can be searched', function () {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $admin->assignRole($adminRole);

    $user = User::factory()->create([
        'name' => 'Searchable User',
    ]);

    $this->actingAs($admin)
        ->get(route('activity-logs.index', ['filter' => ['search' => 'User']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/index')
            ->has('activityLogs.data')
        );
});

test('activity logs are paginated', function () {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $admin->assignRole($adminRole);

    // Create multiple users to generate activity logs
    User::factory()->count(15)->create();

    $this->actingAs($admin)
        ->get(route('activity-logs.index', ['per_page' => 10]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('activity-logs/index')
            ->where('activityLogs.per_page', 10)
            ->where('activityLogs.current_page', 1)
        );
});

test('sensitive fields are not logged', function () {
    $user = User::factory()->create([
        'password' => 'secret-password',
    ]);

    $activity = Activity::where('subject_type', User::class)
        ->where('subject_id', $user->id)
        ->where('event', 'created')
        ->first();

    $this->assertNotNull($activity);
    $properties = $activity->properties;

    // Check that password is not in the logged properties
    if (isset($properties['attributes'])) {
        $this->assertArrayNotHasKey('password', $properties['attributes']);
    }
});
