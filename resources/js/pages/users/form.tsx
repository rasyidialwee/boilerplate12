import {
    type BreadcrumbItem,
    type Role,
    type SharedData,
    type User,
} from '@/types';
import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

interface UsersFormProps {
    user?: User;
    roles: Role[];
}

export default function UsersForm({ user, roles }: UsersFormProps) {
    const { auth, url } = usePage<SharedData>().props;
    const isEditMode = !!user;

    // Check if user has admin or superadmin role, redirect if not
    useEffect(() => {
        if (auth.user?.role !== 'superadmin' && auth.user?.role !== 'admin') {
            router.visit(dashboard().url);
        }
    }, [auth.user?.role]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: isEditMode ? 'Edit User' : 'Create User',
            href: isEditMode ? `/users/${user?.id}/edit` : '/users/create',
        },
    ];

    if (auth.user?.role !== 'superadmin' && auth.user?.role !== 'admin') {
        return null;
    }

    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        password: string;
        role: number | '';
    }>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.roles?.[0]?.id ?? '',
    });

    // Update form data when user prop changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name ?? '',
                email: user.email ?? '',
                password: '',
                role: user.roles?.[0]?.id ?? '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, url]);

    const formAction = isEditMode ? `/users/${user?.id}` : '/users';
    const formMethod = isEditMode ? 'patch' : 'post';
    const pageTitle = isEditMode ? 'Edit User' : 'Create User';
    const pageDescription = isEditMode
        ? 'Update user details and role'
        : 'Create a new user with role assignment. A secure password will be automatically generated and sent to the user via email.';
    const submitButtonText = isEditMode ? 'Update User' : 'Create User';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/users">
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
                                        Name{' '}
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
                                        placeholder="John Doe"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="john@example.com"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {isEditMode && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }
                                            placeholder="Leave blank to keep current password"
                                        />
                                        <InputError message={errors.password} />
                                        <p className="text-xs text-muted-foreground">
                                            Leave blank to keep the current
                                            password
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="role">
                                        Role{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={
                                            formData.role
                                                ? formData.role.toString()
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                role: parseInt(value),
                                            })
                                        }
                                        required
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.id.toString()}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="hidden"
                                        name="role"
                                        value={formData.role || ''}
                                    />
                                    <InputError message={errors.role} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        <Check className="mr-2 h-4 w-4" />
                                        {submitButtonText}
                                    </Button>
                                    <Link href="/users">
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

