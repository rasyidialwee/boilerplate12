# Notification System

A comprehensive notification system that displays user notifications in a dropdown menu next to the dark mode toggle, with a dedicated page to view all notifications.

## Features

- **Notification Dropdown**: Bell icon with unread count badge in the sidebar header
- **Real-time Updates**: Notifications automatically refresh when marked as read
- **Dedicated Page**: Full notifications page with pagination
- **Mark as Read**: Individual and bulk mark-as-read functionality
- **Action URLs**: Notifications can link to specific pages
- **Type System**: Support for different notification types (info, success, warning, error)

## Database Structure

The notification system uses a `notifications` table with the following structure:

```php
- id (bigint, primary key)
- user_id (foreign key to users table)
- title (string)
- message (text)
- type (string, default: 'info') // info, success, warning, error
- action_url (string, nullable)
- read_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## Creating Notifications

### Basic Usage

```php
use App\Models\Notification;

// Create a notification for a user
Notification::create([
    'user_id' => $user->id,
    'title' => 'Welcome!',
    'message' => 'Thank you for joining our platform.',
    'type' => 'info',
    'action_url' => '/dashboard',
]);
```

### Using the User Relationship

```php
$user = User::find(1);

$user->notifications()->create([
    'title' => 'Profile Updated',
    'message' => 'Your profile has been successfully updated.',
    'type' => 'success',
    'action_url' => '/account/profile',
]);
```

### Notification Types

The system supports four notification types:

- **`info`**: General information (default)
- **`success`**: Success messages
- **`warning`**: Warning messages
- **`error`**: Error/alert messages

Each type has different badge colors in the UI.

## Examples

### Example 1: User Registration Notification

```php
use App\Models\Notification;

// When a new user registers
$user->notifications()->create([
    'title' => 'Welcome to the Platform!',
    'message' => 'Thank you for joining us. Get started by exploring the dashboard.',
    'type' => 'info',
    'action_url' => '/dashboard',
]);
```

### Example 2: Password Changed Notification

```php
// After password change
auth()->user()->notifications()->create([
    'title' => 'Password Changed',
    'message' => 'Your password was successfully changed.',
    'type' => 'success',
    'action_url' => null,
]);
```

### Example 3: Security Alert

```php
// Security alert
$user->notifications()->create([
    'title' => 'Security Alert',
    'message' => 'We detected a login from a new device. If this was not you, please change your password.',
    'type' => 'error',
    'action_url' => '/account/password',
]);
```

### Example 4: System Update Notification

```php
// Broadcast to all users
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        $user->notifications()->create([
            'title' => 'System Update Completed',
            'message' => 'The system has been successfully updated to the latest version.',
            'type' => 'success',
            'action_url' => null,
        ]);
    }
});
```

## API Endpoints

### Get All Notifications (Page)

**GET** `/notifications`

Returns a paginated list of all notifications for the authenticated user.

**Response:**

```json
{
    "notifications": {
        "data": [
            {
                "id": 1,
                "title": "Welcome!",
                "message": "Thank you for joining...",
                "type": "info",
                "action_url": "/dashboard",
                "read_at": null,
                "created_at": "2025-12-30T10:00:00.000000Z"
            }
        ],
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 75
    }
}
```

### Mark Notification as Read

**POST** `/api/notifications/{notification}/read`

Marks a specific notification as read.

**Response:** Redirects back (Inertia response)

### Mark All Notifications as Read

**POST** `/api/notifications/read-all`

Marks all unread notifications for the authenticated user as read.

**Response:** Redirects back (Inertia response)

## Frontend Usage

### Accessing Notifications in Components

The notification dropdown automatically receives unread notifications through Inertia's shared data:

```typescript
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const page = usePage<
    SharedData & {
        unreadNotifications?: Notification[];
        unreadNotificationCount?: number;
    }
>();

const { unreadNotifications, unreadNotificationCount } = page.props;
```

### Notification Dropdown Component

The notification dropdown is automatically included in the sidebar header. It displays:

- Bell icon with unread count badge
- Up to 5 latest unread notifications
- "View all notifications" link

### Notifications Page

Users can access the full notifications page at `/notifications` which shows:

- All notifications with pagination
- Mark individual notifications as read
- Mark all notifications as read button
- Type badges
- Action buttons for notifications with `action_url`

## Model Methods

### Notification Model

```php
// Check if notification is read
$notification->isRead(); // returns bool

// Mark notification as read
$notification->markAsRead(); // returns bool

// Get the user who owns the notification
$notification->user; // returns User model
```

### User Model

```php
// Get all notifications
$user->notifications; // returns HasMany relationship

// Get unread notifications
$user->unreadNotifications; // returns HasMany relationship with whereNull('read_at')

// Count unread notifications
$user->unreadNotifications()->count();
```

## Seeding Test Data

A `NotificationSeeder` is available to create test notifications:

```php
php artisan db:seed --class=NotificationSeeder
```

This creates 3-7 random notifications per user with various types and some marked as read.

## Styling

The notification system uses Tailwind CSS classes and supports dark mode. Notification types have color-coded badges:

- **info**: Blue badge
- **success**: Green badge
- **warning**: Yellow badge
- **error**: Red badge

## Best Practices

1. **Keep Titles Short**: Notification titles should be concise (under 60 characters)
2. **Clear Messages**: Messages should be clear and actionable
3. **Use Action URLs**: Provide action URLs when users need to take action
4. **Appropriate Types**: Use the correct notification type for better UX
5. **Don't Spam**: Avoid creating too many notifications at once
6. **Clean Up**: Consider archiving or deleting old read notifications periodically

## Integration Examples

### In Controllers

```php
use App\Models\Notification;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $user = User::create($request->validated());

        // Create welcome notification
        $user->notifications()->create([
            'title' => 'Account Created',
            'message' => 'Your account has been successfully created.',
            'type' => 'success',
            'action_url' => '/dashboard',
        ]);

        return redirect()->route('users.index');
    }
}
```

### In Events/Listeners

```php
use App\Models\Notification;

class UserRegisteredListener
{
    public function handle(UserRegistered $event)
    {
        $event->user->notifications()->create([
            'title' => 'Welcome!',
            'message' => 'Thank you for registering. Please verify your email.',
            'type' => 'info',
            'action_url' => '/email/verify',
        ]);
    }
}
```

### In Jobs

```php
use App\Models\Notification;
use App\Models\User;

class SendMaintenanceNotification implements ShouldQueue
{
    public function handle()
    {
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                $user->notifications()->create([
                    'title' => 'Scheduled Maintenance',
                    'message' => 'System maintenance is scheduled for this weekend.',
                    'type' => 'warning',
                    'action_url' => null,
                ]);
            }
        });
    }
}
```

## Troubleshooting

### Notifications Not Appearing

1. **Check Migration**: Ensure the migration has been run
2. **Check User Relationship**: Verify the User model has the `notifications()` relationship
3. **Check Middleware**: Ensure `HandleInertiaRequests` includes unread notifications in shared data
4. **Check Authentication**: Notifications only show for authenticated users

### Dropdown Not Showing

1. **Check Component**: Ensure `NotificationDropdown` is imported in `app-sidebar-header.tsx`
2. **Check Build**: Rebuild frontend assets with `npm run build` or `npm run dev`
3. **Check Browser**: Hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R)

### Notifications Not Updating

1. **Check Inertia**: Ensure you're using Inertia's `router.post()` for mark-as-read actions
2. **Check `only` Option**: The dropdown uses `only: ['unreadNotifications', 'unreadNotificationCount']` to update
3. **Check Shared Data**: Verify middleware is returning updated notification data

## Migration

To add this system to an existing project:

1. Run the migration: `php artisan migrate`
2. Ensure User model has the notification relationships
3. Update `HandleInertiaRequests` middleware
4. Add routes to `routes/web.php`
5. Copy frontend components
6. Update sidebar header to include the dropdown

## Support

For issues or questions, refer to the main application documentation or contact the development team.
