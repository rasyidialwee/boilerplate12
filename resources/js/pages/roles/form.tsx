import {
    type BreadcrumbItem,
    type Permission,
    type Role,
    type SharedData,
} from '@/types';
import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

interface RolesFormProps {
    role?: Role;
    permissions: Permission[];
}

export default function RolesForm({ role, permissions }: RolesFormProps) {
    const { auth, url } = usePage<SharedData>().props;
    const isEditMode = !!role;

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
        {
            title: isEditMode ? 'Edit Role' : 'Create Role',
            href: isEditMode ? `/roles/${role?.id}/edit` : '/roles/create',
        },
    ];

    if (auth.user?.role !== 'superadmin') {
        return null;
    }

    const [formData, setFormData] = useState({
        name: role?.name ?? '',
        permissions: role?.permissions?.map((p) => p.id) ?? [],
    });

    // Create a stable key from role permissions to detect changes
    const rolePermissionsKey = useMemo(() => {
        if (!role?.permissions) return '';
        return role.permissions
            .map((p) => p.id)
            .sort()
            .join(',');
    }, [role?.permissions]);

    // Categorize permissions by resource
    const categorizedPermissions = useMemo(() => {
        const categories: Record<string, Permission[]> = {};

        permissions.forEach((permission) => {
            // Extract category from permission name (e.g., "create users" -> "users")
            const parts = permission.name.split(' ');
            const category =
                parts.length > 1 ? parts.slice(1).join(' ') : 'Other';

            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(permission);
        });

        // Sort categories alphabetically and sort permissions within each category
        return Object.keys(categories)
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = categories[key].sort((a, b) =>
                        a.name.localeCompare(b.name),
                    );
                    return acc;
                },
                {} as Record<string, Permission[]>,
            );
    }, [permissions]);

    // Update form data when role prop changes or when navigating back
    useEffect(() => {
        if (role) {
            const permissionIds = role.permissions?.map((p) => p.id) ?? [];
            setFormData({
                name: role.name ?? '',
                permissions: permissionIds,
            });
        } else {
            setFormData({
                name: '',
                permissions: [],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role?.id, rolePermissionsKey, url]); // Update when role ID, permissions, or URL changes

    const formAction = isEditMode ? `/roles/${role?.id}` : '/roles';
    const formMethod = isEditMode ? 'patch' : 'post';
    const pageTitle = isEditMode ? 'Edit Role' : 'Create Role';
    const pageDescription = isEditMode
        ? 'Update role details and permissions'
        : 'Create a new role with permissions';
    const submitButtonText = isEditMode ? 'Update Role' : 'Create Role';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/roles">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{pageTitle}</h1>
                        <p className="text-muted-foreground">
                            {pageDescription}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <Form
                        action={formAction}
                        method={formMethod}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Role Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., admin, editor"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Hidden input for guard_name */}
                                <input
                                    type="hidden"
                                    name="guard_name"
                                    value="web"
                                />

                                {/* Hidden inputs for permissions array */}
                                {formData.permissions.map(
                                    (permissionId, index) => (
                                        <input
                                            key={`permission-${permissionId}`}
                                            type="hidden"
                                            name={`permissions[${index}]`}
                                            value={permissionId}
                                        />
                                    ),
                                )}

                                <div className="space-y-4">
                                    <Label>Permissions</Label>
                                    <div className="rounded-lg border p-4">
                                        {permissions.length > 0 && (
                                            <div className="mb-4 flex items-center space-x-2 border-b pb-4">
                                                <Checkbox
                                                    id="select-all"
                                                    checked={
                                                        formData.permissions
                                                            .length ===
                                                        permissions.length
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        if (checked) {
                                                            setFormData({
                                                                ...formData,
                                                                permissions:
                                                                    permissions.map(
                                                                        (p) =>
                                                                            p.id,
                                                                    ),
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                permissions: [],
                                                            });
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor="select-all"
                                                    className="text-sm font-semibold"
                                                >
                                                    Select All Permissions
                                                </Label>
                                            </div>
                                        )}
                                        <div className="max-h-96 space-y-6 overflow-y-auto">
                                            {permissions.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    No permissions available
                                                </p>
                                            ) : (
                                                Object.entries(
                                                    categorizedPermissions,
                                                ).map(
                                                    ([
                                                        category,
                                                        categoryPermissions,
                                                    ]) => (
                                                        <div
                                                            key={category}
                                                            className="space-y-3"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-semibold text-foreground capitalize">
                                                                    {category}
                                                                </h4>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const categoryPermissionIds =
                                                                            categoryPermissions.map(
                                                                                (
                                                                                    p,
                                                                                ) =>
                                                                                    p.id,
                                                                            );
                                                                        const allSelected =
                                                                            categoryPermissionIds.every(
                                                                                (
                                                                                    id,
                                                                                ) =>
                                                                                    formData.permissions.includes(
                                                                                        id,
                                                                                    ),
                                                                            );

                                                                        if (
                                                                            allSelected
                                                                        ) {
                                                                            // Deselect all in this category
                                                                            setFormData(
                                                                                {
                                                                                    ...formData,
                                                                                    permissions:
                                                                                        formData.permissions.filter(
                                                                                            (
                                                                                                id,
                                                                                            ) =>
                                                                                                !categoryPermissionIds.includes(
                                                                                                    id,
                                                                                                ),
                                                                                        ),
                                                                                },
                                                                            );
                                                                        } else {
                                                                            // Select all in this category
                                                                            const newPermissions =
                                                                                [
                                                                                    ...new Set(
                                                                                        [
                                                                                            ...formData.permissions,
                                                                                            ...categoryPermissionIds,
                                                                                        ],
                                                                                    ),
                                                                                ];
                                                                            setFormData(
                                                                                {
                                                                                    ...formData,
                                                                                    permissions:
                                                                                        newPermissions,
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="text-xs text-primary hover:underline"
                                                                >
                                                                    {categoryPermissions.every(
                                                                        (p) =>
                                                                            formData.permissions.includes(
                                                                                p.id,
                                                                            ),
                                                                    )
                                                                        ? 'Deselect All'
                                                                        : 'Select All'}
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                {categoryPermissions.map(
                                                                    (
                                                                        permission,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                permission.id
                                                                            }
                                                                            className="flex items-center space-x-2"
                                                                        >
                                                                            <Checkbox
                                                                                id={`permission-${permission.id}`}
                                                                                checked={formData.permissions.includes(
                                                                                    permission.id,
                                                                                )}
                                                                                onCheckedChange={(
                                                                                    checked,
                                                                                ) => {
                                                                                    if (
                                                                                        checked
                                                                                    ) {
                                                                                        setFormData(
                                                                                            {
                                                                                                ...formData,
                                                                                                permissions:
                                                                                                    [
                                                                                                        ...formData.permissions,
                                                                                                        permission.id,
                                                                                                    ],
                                                                                            },
                                                                                        );
                                                                                    } else {
                                                                                        setFormData(
                                                                                            {
                                                                                                ...formData,
                                                                                                permissions:
                                                                                                    formData.permissions.filter(
                                                                                                        (
                                                                                                            id,
                                                                                                        ) =>
                                                                                                            id !==
                                                                                                            permission.id,
                                                                                                    ),
                                                                                            },
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Label
                                                                                htmlFor={`permission-${permission.id}`}
                                                                                className="text-sm font-normal"
                                                                            >
                                                                                {
                                                                                    permission.name
                                                                                }
                                                                            </Label>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.permissions} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        <Check className="mr-2 h-4 w-4" />
                                        {submitButtonText}
                                    </Button>
                                    <Link href="/roles">
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
