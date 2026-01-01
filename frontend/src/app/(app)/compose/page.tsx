'use client';

import { useComposePage } from '@/lib/compose/useComposePage';
import { useComposeMetrics } from '@/lib/compose/useComposeMetrics';
import { useComposeSubmit } from '@/lib/compose/useComposeSubmit';
import { useComposeGroupDialog } from '@/lib/compose/useComposeGroupDialog';

import ComposeHeader from '@/components/compose/ComposeHeader';
import ComposeBodyCard from '@/components/compose/ComposeBodyCard';
import ComposeEmojiCard from '@/components/compose/ComposeEmojiCard';
import ComposeIntensityCard from '@/components/compose/ComposeIntensityCard';
import ComposePrivacyCard from '@/components/compose/ComposePrivacyCard';
import ComposeSensitiveToggle from '@/components/compose/ComposeSensitiveToggle';
import ComposeStickyBar from '@/components/compose/ComposeStickyBar';
import ComposeGroupDialog from '@/components/compose/ComposeGroupDialog';
import ComposeFormError from '@/components/compose/ComposeFormError';

export default function ComposePage() {
  const { postBody } = useComposePage();
  const {
    text,
    setText,
    emoji,
    setEmoji,
    intensity,
    setIntensity,
    crisisFlag,
    setCrisisFlag,
    privacyJson,
    setPrivacyJson,
  } = postBody;

  const metrics = useComposeMetrics({ text, privacyJson, limit: 280 });

  const submit = useComposeSubmit({
    privacyJson,
    postBody,
  });

  const group = useComposeGroupDialog();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-sky-50">
      <ComposeHeader
        privacySummary={metrics.privacySummary}
        left={metrics.left}
      />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-4">
        <form
          id="composeForm"
          action={submit.formAction}
          className="space-y-5"
          noValidate
        >
          <ComposeBodyCard
            text={text}
            onTextChange={setText}
            metrics={metrics}
            bodyError={submit.fieldErrors?.body}
            canSubmit={metrics.canSubmit}
            pending={submit.pending}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch">
            <ComposeEmojiCard emoji={emoji} onChange={setEmoji} />

            <ComposeIntensityCard
              intensity={intensity}
              onChange={setIntensity}
              error={submit.fieldErrors?.intensity}
            />
          </div>

          <ComposeFormError error={submit.formError} />

          <ComposePrivacyCard
            value={privacyJson}
            onChange={setPrivacyJson}
            userOptions={[]}
            onRequestCreateGroup={group.requestCreateGroup}
          />

          <ComposeSensitiveToggle
            crisisFlag={crisisFlag}
            onChange={setCrisisFlag}
          />
        </form>
      </div>

      <ComposeStickyBar
        privacySummary={metrics.privacySummary}
        emoji={emoji}
        metrics={metrics}
        canSubmit={metrics.canSubmit}
        pending={submit.pending}
        formId="composeForm"
      />

      <ComposeGroupDialog {...group.dialogProps} />
    </main>
  );
}
