import {
    type BreadcrumbItem,
    type Role,
    type SharedData,
    type User,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm } from 'laravel-precognition-react-inertia';

interface UsersFormProps {
    user?: User;
    roles: Role[];
}

export default function UsersForm({ user, roles }: UsersFormProps) {
    const { auth, url } = usePage<SharedData>().props;
    const isEditMode = !!user;

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

    // Initialize Precognition form
    const form = useForm(
        isEditMode ? 'patch' : 'post',
        isEditMode ? `/users/${user?.id}` : '/users',
        {
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            role: user?.roles?.[0]?.id ?? '',
        },
    );

    const submitForm = () => {
        if (!form.processing) {
            form.submit({
                onSuccess: () => {
                    router.visit('/users');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitForm();
    };

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLFormElement>) => {
            // Prevent form submission on Enter key unless explicitly on submit button
            if (e.key === 'Enter') {
                const target = e.target as HTMLElement;
                if (
                    target instanceof HTMLButtonElement &&
                    target.type === 'submit'
                ) {
                    // Allow Enter on submit button - form's onSubmit will handle it
                    return;
                }
                e.preventDefault();
            }
        },
        [],
    );

    const rolesOptions = useMemo(
        () =>
            roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                </SelectItem>
            )),
        [roles],
    );

    // Update form data when user prop changes
    useEffect(() => {
        if (user) {
            form.setData('name', user.name ?? '');
            form.setData('email', user.email ?? '');
            form.setData('password', '');
            form.setData('role', user.roles?.[0]?.id ?? '');
        } else {
            form.setData('name', '');
            form.setData('email', '');
            form.setData('password', '');
            form.setData('role', '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, url]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditMode ? 'Edit User' : 'Create User'} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/users">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {isEditMode ? 'Edit User' : 'Create User'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditMode
                                ? 'Update user details and role'
                                : 'Create a new user with role assignment. A secure password will be automatically generated and sent to the user via email.'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                onBlur={() => form.validate('name')}
                                placeholder="John Doe"
                                required
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                onBlur={() => form.validate('email')}
                                placeholder="john@example.com"
                                required
                            />
                            <InputError message={form.errors.email} />
                        </div>

                        {isEditMode && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData('password', e.target.value)
                                    }
                                    onBlur={() => form.validate('password')}
                                    placeholder="Leave blank to keep current password"
                                />
                                <InputError message={form.errors.password} />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep the current password
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="role">
                                Role <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={
                                    form.data.role
                                        ? form.data.role.toString()
                                        : undefined
                                }
                                onValueChange={(value) => {
                                    form.setData('role', parseInt(value));
                                    form.validate('role');
                                }}
                                required
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>{rolesOptions}</SelectContent>
                            </Select>
                            <InputError message={form.errors.role} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={form.processing}>
                                <Check className="mr-2 h-4 w-4" />
                                {isEditMode ? 'Update User' : 'Create User'}
                            </Button>
                            <Link href="/users">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
