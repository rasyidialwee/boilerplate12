<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        $notificationTemplates = [
            [
                'title' => 'Welcome to the platform!',
                'message' => 'Thank you for joining us. Get started by exploring the dashboard.',
                'type' => 'info',
                'action_url' => '/dashboard',
            ],
            [
                'title' => 'Profile Update Required',
                'message' => 'Please complete your profile information to unlock all features.',
                'type' => 'warning',
                'action_url' => '/account/profile',
            ],
            [
                'title' => 'New User Registered',
                'message' => 'A new user has registered and is awaiting approval.',
                'type' => 'info',
                'action_url' => '/users',
            ],
            [
                'title' => 'System Update Completed',
                'message' => 'The system has been successfully updated to the latest version.',
                'type' => 'success',
                'action_url' => null,
            ],
            [
                'title' => 'Security Alert',
                'message' => 'We detected a login from a new device. If this was not you, please change your password.',
                'type' => 'error',
                'action_url' => '/account/password',
            ],
            [
                'title' => 'Password Changed',
                'message' => 'Your password was successfully changed.',
                'type' => 'success',
                'action_url' => null,
            ],
            [
                'title' => 'New Feature Available',
                'message' => 'Check out our new two-factor authentication feature for enhanced security.',
                'type' => 'info',
                'action_url' => '/account/two-factor',
            ],
            [
                'title' => 'Weekly Report Ready',
                'message' => 'Your weekly activity report is now available for review.',
                'type' => 'info',
                'action_url' => '/activity-logs',
            ],
            [
                'title' => 'Role Updated',
                'message' => 'Your account role has been updated by an administrator.',
                'type' => 'warning',
                'action_url' => null,
            ],
            [
                'title' => 'Scheduled Maintenance',
                'message' => 'System maintenance is scheduled for this weekend. Some features may be unavailable.',
                'type' => 'warning',
                'action_url' => null,
            ],
        ];

        foreach ($users as $user) {
            $selectedNotifications = collect($notificationTemplates)
                ->random(rand(3, 7))
                ->values();

            foreach ($selectedNotifications as $index => $template) {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => $template['title'],
                    'message' => $template['message'],
                    'type' => $template['type'],
                    'action_url' => $template['action_url'],
                    'read_at' => $index < 2 ? null : (rand(0, 1) ? now()->subHours(rand(1, 48)) : null),
                    'created_at' => now()->subHours(rand(1, 168)),
                ]);
            }
        }
    }
}
