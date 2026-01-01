import { useMemo, useState } from 'react';
import type { PrivacySetting } from '@/lib/privacy/types';

type Initial = {
  text?: string;
  emoji?: string;
  intensity?: number | undefined;
  crisisFlag?: boolean;
  privacyJson?: PrivacySetting | undefined;
};

export function useComposePage(initial?: Initial) {
  const [text, setText] = useState(() => initial?.text ?? '');
  const [emoji, setEmoji] = useState(() => initial?.emoji ?? '');
  const [intensity, setIntensity] = useState<number | undefined>(
    () => initial?.intensity,
  );
  const [crisisFlag, setCrisisFlag] = useState(
    () => initial?.crisisFlag ?? false,
  );
  const [privacyJson, setPrivacyJson] = useState<PrivacySetting | undefined>(
    () => initial?.privacyJson ?? undefined,
  );

  // postBody の参照を安定化
  const postBody = useMemo(
    () => ({
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
    }),
    [text, emoji, intensity, crisisFlag, privacyJson],
  );

  return { postBody };
}
