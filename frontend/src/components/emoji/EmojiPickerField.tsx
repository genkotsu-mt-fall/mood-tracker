'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import { useMountEmojiPicker } from '@/hooks/useMountEmojiPicker';
import { firstGraphemeIntl } from '@genkotsu-mt-fall/shared/schemas';

export type EmojiPickerFieldProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  inputClassName?: string;
  buttonAriaLabel?: string;
};

export default function EmojiPickerField({
  value,
  onChange,
  placeholder = '🙂',
  inputClassName = '',
  buttonAriaLabel = '絵文字を選ぶ',
}: EmojiPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [composing, setComposing] = useState(false);

  const segmenter = useMemo(() => {
    return new Intl.Segmenter('ja', { granularity: 'grapheme' });
  }, []);

  const commit = (raw: string) => {
    const first = firstGraphemeIntl(raw, 'ja', segmenter);
    onChange(first);
  };

  useMountEmojiPicker({
    open,
    hostRef,
    onSelect: (emoji) => {
      // onChange(emoji.native);
      commit(emoji.native);
      setOpen(false);
    },
    options: {
      // ここで picker のオプションを上書き可能
    },
  });

  return (
    <div className="relative mt-1">
      <input
        name="emoji"
        value={value}
        onChange={(e) => {
          if (composing) return;
          commit(e.target.value);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const data = e.clipboardData.getData('text');
          commit(data);
        }}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={(e) => {
          setComposing(false);
          commit((e.target as HTMLInputElement).value);
        }}
        placeholder={placeholder}
        inputMode="text"
        aria-label="絵文字は1文字のみ"
        className={`w-full rounded-md border px-2 py-1 pr-10 text-sm ${inputClassName}`}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={buttonAriaLabel}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md border text-gray-700 hover:bg-gray-50"
          >
            <Smile className="h-4 w-4" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 w-[360px]"
          align="end"
          side="bottom"
          sideOffset={8}
        >
          {/* 初期計測安定のためサイズを明示 */}
          <div ref={hostRef} className="h-[420px] w-[360px]" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
