import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import DataTablePagination from '@/components/data-table-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
}

interface ActivityLogsIndexProps {
    activityLogs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ActivityLogsIndex({
    activityLogs,
}: ActivityLogsIndexProps) {
    const { url } = usePage<SharedData>().props;

    // Get search value from URL
    const getSearchFromUrl = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('filter[search]') || '';
        }
        return '';
    };

    const [search, setSearch] = useState(getSearchFromUrl());

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Activity Logs',
            href: '/activity-logs',
        },
    ];

    // Update search when URL changes (e.g., back button)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('filter[search]') || '';
            setSearch(searchParam);
        }
    }, [url]);

    // Debounced search - triggers when search has at least 3 characters
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();
            const trimmedSearch = search.trim();
            const currentParams = new URLSearchParams(window.location.search);
            const hasExistingFilter = currentParams.has('filter[search]');

            // Only search if 3+ characters
            if (trimmedSearch.length >= 3) {
                params.set('filter[search]', trimmedSearch);
                router.get(
                    `/activity-logs?${params.toString()}`,
                    {},
                    {
                        preserveState: true,
                        preserveScroll: false,
                    },
                );
            } else if (trimmedSearch.length === 0 && hasExistingFilter) {
                // Clear filter if search is empty and there was a previous filter
                router.get(
                    '/activity-logs',
                    {},
                    {
                        preserveState: true,
                        preserveScroll: false,
                    },
                );
            }
            // If 1-2 characters, do nothing (wait for more input)
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleClearSearch = () => {
        setSearch('');
    };

    // Get per_page from URL
    const getPerPageFromUrl = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const perPage = urlParams.get('per_page');
            return perPage ? Number(perPage) : activityLogs.per_page;
        }
        return activityLogs.per_page;
    };

    const [perPage, setPerPage] = useState(getPerPageFromUrl());

    // Update per_page when URL changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const perPageParam = urlParams.get('per_page');
            if (perPageParam) {
                setPerPage(Number(perPageParam));
            }
        }
    }, [url, activityLogs.per_page]);

    const getPaginationUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        if (search.trim()) {
            params.set('filter[search]', search.trim());
        }
        if (perPage !== 10) {
            params.set('per_page', String(perPage));
        }
        return `/activity-logs?${params.toString()}`;
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        const params = new URLSearchParams();
        if (search.trim()) {
            params.set('filter[search]', search.trim());
        }
        params.set('per_page', String(newPerPage));
        // Reset to page 1 when changing per_page
        params.set('page', '1');

        router.get(
            `/activity-logs?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: false,
            },
        );
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Activity Logs</h1>
                        <p className="text-muted-foreground">
                            View all system activity and changes
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search activity logs... (min 3 characters)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pr-10 pl-10"
                            />
                            {search && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSearch}
                                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {search.length > 0 && search.length < 3 && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Type at least 3 characters to search
                            </p>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Event
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Subject
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLogs.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No activity logs found
                                        </td>
                                    </tr>
                                ) : (
                                    activityLogs.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b last:border-0 hover:bg-muted/50"
                                        >
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(
                                                    log.created_at,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {log.causer?.name ||
                                                    log.causer?.email ||
                                                    'System'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEventBadgeColor(log.event)}`}
                                                >
                                                    {log.event}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {getSubjectTypeName(
                                                    log.subject_type,
                                                )}
                                                #{log.subject_id}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {log.description}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/activity-logs/${log.id}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t">
                        <DataTablePagination
                            currentPage={activityLogs.current_page}
                            lastPage={activityLogs.last_page}
                            perPage={perPage}
                            total={activityLogs.total}
                            onPageChange={getPaginationUrl}
                            onPerPageChange={handlePerPageChange}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

