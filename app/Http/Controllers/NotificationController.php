<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        auth()->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return back();
    }
}
