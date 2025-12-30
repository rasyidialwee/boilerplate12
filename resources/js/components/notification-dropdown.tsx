import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { HTMLAttributes, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    action_url: string | null;
    read_at: string | null;
    created_at: string;
}

interface NotificationDropdownProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export default function NotificationDropdown({
    className = '',
    ...props
}: NotificationDropdownProps) {
    const page = usePage<SharedData & {
        unreadNotifications?: Notification[];
        unreadNotificationCount?: number;
    }>();
    const unreadNotifications = page.props.unreadNotifications || [];
    const unreadNotificationCount = page.props.unreadNotificationCount || 0;
    const [isOpen, setIsOpen] = useState(false);

    const handleMarkAsRead = (notificationId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        router.post(
            `/api/notifications/${notificationId}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['unreadNotifications', 'unreadNotificationCount'],
            },
        );
    };

    const handleNotificationClick = (
        notification: Notification,
        e: React.MouseEvent,
    ) => {
        // Only navigate if there's an action URL, don't mark as read
        if (notification.action_url) {
            router.visit(notification.action_url);
        }
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 rounded-md"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadNotificationCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                            >
                                {unreadNotificationCount > 9
                                    ? '9+'
                                    : unreadNotificationCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-80"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {unreadNotificationCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadNotificationCount} new
                            </Badge>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-[400px] overflow-y-auto">
                        {unreadNotifications.length === 0 ? (
                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                No new notifications
                            </div>
                        ) : (
                            unreadNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        'px-3 py-2.5 transition-colors',
                                        !notification.read_at &&
                                            'bg-accent/50',
                                    )}
                                >
                                    <div
                                        className="cursor-pointer"
                                        onClick={(e) =>
                                            handleNotificationClick(
                                                notification,
                                                e,
                                            )
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <p
                                                className={cn(
                                                    'text-sm font-medium',
                                                    !notification.read_at &&
                                                        'font-semibold',
                                                )}
                                            >
                                                {notification.title}
                                            </p>
                                            {!notification.read_at && (
                                                <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(
                                                notification.created_at,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-xs text-primary hover:underline"
                                            onClick={(e) =>
                                                handleMarkAsRead(
                                                    notification.id,
                                                    e,
                                                )
                                            }
                                        >
                                            Mark as read
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {unreadNotifications.length > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <div className="p-1">
                                <Link
                                    href="/notifications"
                                    className="flex w-full items-center justify-center rounded-sm px-2 py-1.5 text-sm font-medium hover:bg-accent"
                                >
                                    View all notifications
                                </Link>
                            </div>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

