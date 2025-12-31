'use server';

import UserPageSection from '@/components/user/UserPageSection';
import { fetchMyProfileFromApi } from '@/lib/user/api';
import { redirect } from 'next/navigation';

type Props = { params: Promise<{ id: string }> };

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  // viewer（自分）をサーバ側で確定して、/users/:id が自分なら /me に正規化
  const meRes = await fetchMyProfileFromApi();
  if (meRes.ok && meRes.data.id === id) {
    redirect('/me');
  }

  return (
    <div className="h-full overflow-auto">
      <div className="h-full px-4 md:px-6 lg:px-8 pt-6 pb-0">
        <UserPageSection id={id} />
      </div>
    </div>
  );
}
