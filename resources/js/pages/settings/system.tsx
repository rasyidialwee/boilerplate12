import SystemSettingsController from '@/actions/App/Http/Controllers/Settings/SystemSettingsController';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System settings',
        href: '/settings/system',
    },
];

interface SystemSettingsProps {
    settings: {
        registration_enabled: boolean;
    };
}

export default function System({ settings }: SystemSettingsProps) {
    const { auth } = usePage<SharedData>().props;
    const [registrationEnabled, setRegistrationEnabled] = useState(
        settings.registration_enabled,
    );
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async (checked: boolean) => {
        setProcessing(true);
        setError(null);
        setRegistrationEnabled(checked);

        router.put(
            SystemSettingsController.update.url(),
            {
                registration_enabled: checked,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRecentlySuccessful(true);
                    setTimeout(() => setRecentlySuccessful(false), 2000);
                },
                onError: (errors) => {
                    setError(
                        errors.registration_enabled ||
                            'Failed to update settings',
                    );
                    // Revert the toggle on error
                    setRegistrationEnabled(!checked);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System settings" />

            <div className="px-4 py-6">
                <div className="max-w-4xl">
                    <div className="space-y-6">
                        <HeadingSmall
                            title="System settings"
                            description="Manage system-wide settings and preferences"
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between space-x-4 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    {processing && (
                                        <Spinner className="h-4 w-4" />
                                    )}
                                    <Switch
                                        id="registration_enabled"
                                        checked={registrationEnabled}
                                        onCheckedChange={handleToggle}
                                        disabled={processing}
                                        data-test="registration-enabled-toggle"
                                    />
                                </div>
                                <div className="grid flex-1 gap-1.5 leading-none">
                                    <Label
                                        htmlFor="registration_enabled"
                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Enable user registration
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow new users to register accounts.
                                        When disabled, the registration button
                                        will be hidden and registration routes
                                        will be blocked.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <InputError className="mt-2" message={error} />
                            )}

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">
                                    Settings saved successfully
                                </p>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
