'use client';

import SettingsProfileSection from '@/components/settings/SettingsProfileSection';

export default function SettingsProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">
          プロフィール編集
        </h1>

        <SettingsProfileSection />
      </div>
    </main>
  );
}
