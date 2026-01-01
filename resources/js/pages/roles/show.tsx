import { type BreadcrumbItem, type Role, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface RolesShowProps {
    role: Role;
}

export default function RolesShow({ role }: RolesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: '/roles',
        },
        {
            title: role.name,
            href: `/roles/${role.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Role Details</h1>
                        <p className="text-muted-foreground">
                            View detailed information about this role
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/roles">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Roles
                            </Button>
                        </Link>
                        <Link href={`/roles/${role.id}/edit`}>
                            <Button>
                                <Shield className="mr-2 h-4 w-4" />
                                Edit Role
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">
                                Role Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </label>
                                    <p className="mt-1 text-base">{role.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Guard Name
                                    </label>
                                    <p className="mt-1 text-base">
                                        {role.guard_name || 'web'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 text-lg font-semibold">
                                Permissions
                            </h2>
                            {role.permissions && role.permissions.length > 0 ? (
                                <div className="mt-4 space-y-2">
                                    {role.permissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="rounded-md border bg-muted/50 p-3"
                                        >
                                            <p className="font-medium">
                                                {permission.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    This role has no permissions assigned.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


