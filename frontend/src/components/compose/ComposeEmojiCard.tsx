'use client';

import EmojiPickerField from '@/components/emoji/EmojiPickerField';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type Props = {
  emoji: string;
  onChange: (v: string) => void;
};

export default function ComposeEmojiCard({ emoji, onChange }: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px] h-full">
      <Card className="h-full rounded-3xl border border-gray-200/80 bg-white/80 [&_*]:bg-transparent flex flex-col">
        <CardHeader className="pb-2">
          <Label className="text-xs text-gray-500">気分（emoji）</Label>
        </CardHeader>

        <CardContent className="pt-0 grow">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-white/80 text-xl">
              {emoji || '🙂'}
            </div>

            <div className="flex-1">
              <div
                className="
                  relative overflow-hidden rounded-xl border border-gray-200/80
                  bg-white/80 backdrop-blur
                  px-3
                  [&_*]:bg-transparent
                  [&_input]:h-10 [&_input]:leading-none [&_input]:border-0 [&_input]:shadow-none
                  [&_input]:pl-0 [&_input]:pr-10
                  [&_button]:h-8 [&_button]:w-8
                  [&_button]:absolute [&_button]:right-1 [&_button]:top-1/2 [&_button]:-translate-y-1/2
                  [&_button]:border [&_button]:border-gray-200 [&_button]:rounded-xl
                "
              >
                <EmojiPickerField value={emoji} onChange={onChange} />
              </div>

              <p className="mt-1 text-[11px] text-gray-400">
                あなたの投稿に小さく表示されます
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
