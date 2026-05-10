import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useTranslation } from 'react-i18next';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-zinc-200 transition-colors">
                    {t('profile.title')}
                </h2>
            }
        >
            <Head title={t('profile.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-zinc-800 transition-colors">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-zinc-800 transition-colors">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-zinc-800 transition-colors">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
