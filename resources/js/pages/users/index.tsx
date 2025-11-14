import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { Button } from '@/components/ui/button';
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
    const { auth } = usePage<SharedData>().props;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{
        id: number;
        name: string;
    } | null>(null);

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

                <div className="rounded-lg border bg-card">
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

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <div className="text-sm text-muted-foreground">
                                Showing {users.data.length} of {users.total}{' '}
                                users
                            </div>
                            <div className="flex gap-2">
                                {users.current_page > 1 && (
                                    <Link
                                        href={`/users?page=${users.current_page - 1}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Previous
                                        </Button>
                                    </Link>
                                )}
                                {users.current_page < users.last_page && (
                                    <Link
                                        href={`/users?page=${users.current_page + 1}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Next
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
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
