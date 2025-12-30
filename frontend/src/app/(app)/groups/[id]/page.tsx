import { GroupEditProvider } from '@/components/group-edit/GroupEditProvider';
import GroupTitleSection from '@/components/group/GroupTitleSection';
import GroupMembersSection from '@/components/group/GroupMembersSection';
import GroupSaveBar from '@/components/group/GroupSaveBar';
import { GroupSaveProvider } from '@/components/group/GroupSaveProvider';
import GroupDeleteSectionClient from '@/components/group/GroupDeleteSection.Client';

type Props = { params: { id: string } };

export default function GroupDetailPage({ params }: Props) {
  const { id } = params;

  // TODO: 本来は権限判定
  const editable = true;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-3 text-lg font-semibold text-gray-900">グループ</h1>

        <GroupEditProvider editable={editable}>
          <GroupSaveProvider id={id}>
            <GroupTitleSection id={id} />
            <GroupMembersSection id={id} />

            {editable ? <GroupDeleteSectionClient id={id} /> : null}

            <GroupSaveBar />
          </GroupSaveProvider>
        </GroupEditProvider>
      </div>
    </main>
  );
}
