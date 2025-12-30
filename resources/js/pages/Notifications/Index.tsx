import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';

import DataTablePagination from '@/components/data-table-pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    action_url: string | null;
    read_at: string | null;
    created_at: string;
}

interface NotificationsIndexProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function NotificationsIndex({
    notifications,
}: NotificationsIndexProps) {
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Notifications',
            href: '/notifications',
        },
    ];

    const handleMarkAsRead = (notificationId: number) => {
        setProcessing(true);
        router.post(
            `/api/notifications/${notificationId}/read`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleMarkAllAsRead = () => {
        setProcessing(true);
        router.post(
            '/api/notifications/read-all',
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleNotificationClick = (notification: Notification) => {
        // Only navigate if there's an action URL
        if (notification.action_url) {
            router.visit(notification.action_url);
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'info':
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };

    const unreadCount = notifications.data.filter(
        (n) => !n.read_at,
    ).length;

    const getPaginationUrl = (page: number) => {
        return `/notifications?page=${page}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground">
                            View and manage all your notifications
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={handleMarkAllAsRead}
                            disabled={processing}
                            className="gap-2"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <div className="divide-y">
                            {notifications.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                                    <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-lg font-medium">
                                        No notifications
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        You're all caught up!
                                    </p>
                                </div>
                            ) : (
                                notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            'group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-muted/50',
                                            !notification.read_at &&
                                                'bg-accent/30',
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3
                                                            className={cn(
                                                                'text-sm font-medium',
                                                                !notification.read_at &&
                                                                    'font-semibold',
                                                            )}
                                                        >
                                                            {notification.title}
                                                        </h3>
                                                        <Badge
                                                            className={cn(
                                                                'text-xs',
                                                                getTypeBadgeColor(
                                                                    notification.type,
                                                                ),
                                                            )}
                                                        >
                                                            {notification.type}
                                                        </Badge>
                                                        {!notification.read_at && (
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                        )}
                                                    </div>
                                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                                        {notification.message}
                                                    </p>
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        {new Date(
                                                            notification.created_at,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!notification.read_at && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMarkAsRead(
                                                                    notification.id,
                                                                )
                                                            }
                                                            disabled={processing}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <CheckCheck className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {notification.action_url && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    notification,
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {notifications.data.length > 0 && (
                        <div className="border-t">
                            <DataTablePagination
                                currentPage={notifications.current_page}
                                lastPage={notifications.last_page}
                                perPage={notifications.per_page}
                                total={notifications.total}
                                onPageChange={getPaginationUrl}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

