import { PrivacySetting } from '@genkotsu-mt-fall/shared/schemas';
import { useMemo, useState } from 'react';

export function useComposePage() {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('');
  const [intensity, setIntensity] = useState<number | undefined>(undefined);
  const [crisisFlag, setCrisisFlag] = useState(false);
  const [privacyJson, setPrivacyJson] = useState<PrivacySetting | undefined>(
    undefined,
  );

  // postBody の参照を安定化（毎レンダで新しい object を作らない）
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
