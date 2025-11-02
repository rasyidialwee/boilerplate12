import { type BreadcrumbItem, type Role, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Info, Pencil, Plus, Shield, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

interface RolesIndexProps {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function RolesIndex({ roles }: RolesIndexProps) {
    const { auth } = usePage<SharedData>().props;

    // Check if user has superadmin role, redirect if not
    useEffect(() => {
        if (auth.user?.role !== 'superadmin') {
            router.visit(dashboard().url);
        }
    }, [auth.user?.role]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: '/roles',
        },
    ];

    if (auth.user?.role !== 'superadmin') {
        return null;
    }

    const handleDelete = (roleId: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/roles/${roleId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Roles</h1>
                        <p className="text-muted-foreground">
                            Manage user roles and permissions
                        </p>
                    </div>
                    <Link href="/roles/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Role
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                    <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Auto-Generated Permissions
                            </h3>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                Permissions are automatically generated based on
                                models and actions. Use the command{' '}
                                <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">
                                    sail artisan permissions:generate
                                </code>{' '}
                                to generate permissions.
                            </p>
                        </div>
                    </div>
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
                                        Guard
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Permissions
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
                                {roles.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No roles found
                                        </td>
                                    </tr>
                                ) : (
                                    roles.data.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="border-b last:border-0 hover:bg-muted/50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {role.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {role.guard_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {role.permissions_count ?? 0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(
                                                    role.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/roles/${role.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                role.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {roles.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <div className="text-sm text-muted-foreground">
                                Showing {roles.data.length} of {roles.total}{' '}
                                roles
                            </div>
                            <div className="flex gap-2">
                                {roles.current_page > 1 && (
                                    <Link
                                        href={`/roles?page=${roles.current_page - 1}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Previous
                                        </Button>
                                    </Link>
                                )}
                                {roles.current_page < roles.last_page && (
                                    <Link
                                        href={`/roles?page=${roles.current_page + 1}`}
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
        </AppLayout>
    );
}
