import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface ActivityLog {
    id: number;
    description: string;
    event: string;
    subject_type: string;
    subject_id: number;
    causer_id: number | null;
    causer?: {
        id: number;
        name: string;
        email: string;
    } | null;
    properties: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

interface ActivityLogShowProps {
    activityLog: ActivityLog;
}

export default function ActivityLogShow({
    activityLog,
}: ActivityLogShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Activity Logs',
            href: '/activity-logs',
        },
        {
            title: 'Activity Log Details',
            href: `/activity-logs/${activityLog.id}`,
        },
    ];

    const getEventBadgeColor = (event: string) => {
        switch (event) {
            case 'created':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'updated':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'deleted':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getSubjectTypeName = (subjectType: string) => {
        return subjectType.split('\\').pop() || subjectType;
    };

    const formatPropertyValue = (value: unknown): string => {
        if (value === null) {
            return 'null';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    const hasChanges =
        activityLog.properties &&
        (activityLog.properties.old || activityLog.properties.attributes);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log Details" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Activity Log Details
                        </h1>
                        <p className="text-muted-foreground">
                            View detailed information about this activity
                        </p>
                    </div>
                    <Link href="/activity-logs">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Logs
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">
                                Basic Information
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Description
                                    </label>
                                    <p className="mt-1">{activityLog.description}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Event
                                    </label>
                                    <p className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEventBadgeColor(activityLog.event)}`}
                                        >
                                            {activityLog.event}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Subject Type
                                    </label>
                                    <p className="mt-1">
                                        {getSubjectTypeName(
                                            activityLog.subject_type,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Subject ID
                                    </label>
                                    <p className="mt-1">
                                        {activityLog.subject_id}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Performed By
                                    </label>
                                    <p className="mt-1">
                                        {activityLog.causer?.name ||
                                            activityLog.causer?.email ||
                                            'System'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Date & Time
                                    </label>
                                    <p className="mt-1">
                                        {new Date(
                                            activityLog.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {hasChanges && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Changes
                                </h3>
                                <div className="space-y-4">
                                    {activityLog.event === 'updated' &&
                                        activityLog.properties.old && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Old Values
                                                </label>
                                                <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-4 text-sm">
                                                    {formatPropertyValue(
                                                        activityLog.properties
                                                            .old,
                                                    )}
                                                </pre>
                                            </div>
                                        )}
                                    {activityLog.properties.attributes && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                {activityLog.event === 'created'
                                                    ? 'Created Values'
                                                    : 'New Values'}
                                            </label>
                                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-4 text-sm">
                                                {formatPropertyValue(
                                                    activityLog.properties
                                                        .attributes,
                                                )}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {Object.keys(activityLog.properties).length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    All Properties
                                </h3>
                                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                                    {JSON.stringify(
                                        activityLog.properties,
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

