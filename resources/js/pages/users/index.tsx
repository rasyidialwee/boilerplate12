import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import DataTablePagination from '@/components/data-table-pagination';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const { auth, url } = usePage<SharedData>().props;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{
        id: number;
        name: string;
    } | null>(null);

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
            title: 'Users',
            href: '/users',
        },
    ];

    const handleDeleteClick = (userId: number, userName: string) => {
        setUserToDelete({ id: userId, name: userName });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            router.delete(`/users/${userToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

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
                    `/users?${params.toString()}`,
                    {},
                    {
                        preserveState: true,
                        preserveScroll: false,
                    },
                );
            } else if (trimmedSearch.length === 0 && hasExistingFilter) {
                // Clear filter if search is empty and there was a previous filter
                router.get(
                    '/users',
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
            return perPage ? Number(perPage) : users.per_page;
        }
        return users.per_page;
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
    }, [url, users.per_page]);

    const getPaginationUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        if (search.trim()) {
            params.set('filter[search]', search.trim());
        }
        if (perPage !== 10) {
            params.set('per_page', String(perPage));
        }
        return `/users?${params.toString()}`;
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
            `/users?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: false,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Users</h1>
                        <p className="text-muted-foreground">
                            Manage system users and their roles
                        </p>
                    </div>
                    <Link href="/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create User
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search users by name or email... (min 3 characters)"
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
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Created
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const isCurrentUser =
                                            auth.user?.id === user.id;
                                        return (
                                            <tr
                                                key={user.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {user.current_role ||
                                                        'No role'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/users/${user.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {!isCurrentUser && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        user.id,
                                                                        user.name,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t">
                        <DataTablePagination
                            currentPage={users.current_page}
                            lastPage={users.last_page}
                            perPage={perPage}
                            total={users.total}
                            onPageChange={getPaginationUrl}
                            onPerPageChange={handlePerPageChange}
                        />
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
            />
        </AppLayout>
    );
}
