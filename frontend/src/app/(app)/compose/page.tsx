'use client';

import { useState, useMemo, useActionState } from 'react';
import EmojiPickerField from '@/components/emoji/EmojiPickerField';
import PrivacyEditor from '@/components/privacy/PrivacyEditor';
import type { PrivacySetting } from '@/lib/privacy/types';
import type { Option } from '@/lib/common/types';
import CreateGroupDialog from '@/components/privacy/CreateGroupDialog';
import { useCreateGroupDialog } from '@/hooks/useCreateGroupDialog';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Image as ImageIcon,
  CalendarClock,
  Lock,
  Smile,
  Sparkles,
  Shield,
} from 'lucide-react';
import { createPostAction, CreatePostState } from './actions';

export default function ComposePage() {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('');
  const [intensity, setIntensity] = useState<number | undefined>(undefined);
  const [crisisFlag, setCrisisFlag] = useState(false);
  const [privacyJson, setPrivacyJson] = useState<PrivacySetting | undefined>(
    undefined,
  );

  const [state, formAction] = useActionState<CreatePostState, FormData>(
    createPostAction,
    { ok: true },
  );

  // 作成ロジック（将来 API に置き換え）
  async function createGroup(name: string): Promise<Option> {
    const created: Option = { id: crypto.randomUUID(), label: name.trim() };
    return created;
  }

  // CreateGroupDialog用の選択状態
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ダイアログ状態・Promise解決は Hook に委譲
  const {
    open,
    setOpen,
    name,
    setName,
    error,
    setError,
    submitting,
    requestCreateGroup,
    handleSubmit,
    handleClose,
  } = useCreateGroupDialog({ onCreate: createGroup });

  // 文字数カウンタ（上限 280 の例）
  const limit = 280;
  const used = text.length;
  const left = Math.max(0, limit - used);
  const pct = Math.min(100, (used / limit) * 100);
  const circleR = 12;
  const circleC = useMemo(() => 2 * Math.PI * circleR, []);
  const dash = Math.round(circleC * (pct / 100));

  const isBodyOk = text.trim().length > 0 && text.trim().length <= limit;
  const canSubmit = isBodyOk;

  const privacySummary = privacyJson ? '設定中' : '未設定';

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-sky-50">
      {/* ヒーロー風ヘッダ */}
      <section className="sticky top-0 z-10 mx-auto w-full max-w-3xl px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-r from-sky-50 to-fuchsia-50 p-4 ring-1 ring-inset ring-sky-100/60">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                投稿作成
              </h1>
              <p className="mt-0.5 text-xs text-gray-500">
                いまの気持ちをシェアしましょう
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
                可視性: {privacySummary}
              </span>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
                残り {left}
              </span>
            </div>
          </div>
        </div>
      </section>

      <>{!state.ok && console.log(state.fields)}</>

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-4">
        <form
          id="composeForm"
          action={formAction}
          className="space-y-5"
          noValidate
        >
          {/* 入力エリア：グラデ枠 + カード + ツールバー */}
          <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px]">
            <Card className="rounded-3xl shadow-sm border border-gray-200/80 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    いまの気持ち…
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* 残り文字の円形インジケータ */}
                    <div className="relative h-7 w-7">
                      <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r={circleR}
                          className="stroke-gray-200"
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r={circleR}
                          strokeWidth="3"
                          fill="none"
                          className={
                            used > limit ? 'stroke-red-500' : 'stroke-blue-500'
                          }
                          strokeDasharray={`${dash} ${circleC}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 grid place-items-center text-[10px] text-gray-500">
                        {left}
                      </span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>AI で下書きを提案（仮）</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-2xl border border-gray-200/80 bg-white/80 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:ring-offset-1 transition-shadow">
                  <textarea
                    name="body"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="いまの気持ち…"
                    rows={6}
                    className="min-h-36 w-full resize-none rounded-2xl border-0 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-0"
                  />
                  {!state.ok && state.fields?.body && (
                    <p className="px-3 pb-2 text-xs text-red-600">
                      {state.fields.body}
                    </p>
                  )}
                  {/* ツールバー */}
                  <div className="flex items-center justify-between border-t bg-white/60 px-2 py-1.5 rounded-b-2xl">
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>絵文字を挿入</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>画像を追加（予定）</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <CalendarClock className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>予約投稿（予定）</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>公開範囲を設定</TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      type="submit"
                      className="h-8 rounded-full px-4"
                      disabled={!canSubmit}
                    >
                      投稿する
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 下段：2カラム（Emoji / 浮き沈み%） */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch">
            {/* 気分(emoji) */}
            <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px] h-full">
              <Card className="h-full rounded-3xl border border-gray-200/80 bg-white/80 [&_*]:bg-transparent flex flex-col">
                <CardHeader className="pb-2">
                  <Label className="text-xs text-gray-500">気分（emoji）</Label>
                </CardHeader>
                <CardContent className="pt-0 grow">
                  <div className="flex items-center gap-3">
                    {/* 左プレビュー：40pxで固定 */}
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-white/80 text-xl">
                      {emoji || '🙂'}
                    </div>

                    {/* 右入力：親がガラス背景、子はすべて透明化して馴染ませる */}
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
                        <EmojiPickerField value={emoji} onChange={setEmoji} />
                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        あなたの投稿に小さく表示されます
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 浮き沈み(%) */}
            <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px] h-full">
              <Card className="h-full rounded-3xl border border-gray-200/80 bg-white/80 flex flex-col">
                <CardHeader className="pb-2">
                  <Label className="text-xs text-gray-500">浮き沈み（%）</Label>
                </CardHeader>
                <CardContent className="pt-1 space-y-3 grow">
                  <div className="flex items-center gap-3">
                    <Slider
                      value={intensity == null ? undefined : [intensity]}
                      max={100}
                      step={1}
                      onValueChange={(v) => setIntensity(v[0])}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      name={intensity == null ? undefined : 'intensity'}
                      min={0}
                      max={100}
                      value={intensity ?? ''}
                      placeholder="未設定"
                      onChange={(e) =>
                        setIntensity(
                          Math.min(
                            100,
                            Math.max(0, Number(e.target.value) || 0),
                          ),
                        )
                      }
                      className="w-20 rounded-xl border bg-white/80 px-2 py-1 text-sm text-right"
                    />
                    {!state.ok && state.fields?.intensity && (
                      <p className="text-xs text-red-600">
                        {state.fields.intensity}
                      </p>
                    )}
                  </div>

                  {/* グラデーションのメーター */}
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-400 transition-[width]"
                      style={{ width: `${intensity}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>不安定</span>
                    <span>安定</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 可視性（privacyJson） */}
          <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px]">
            <Card className="rounded-3xl border border-gray-200/80 bg-white/80">
              <CardHeader className="pb-2">
                <Label className="text-xs text-gray-500">
                  可視性 (privacyJson)
                </Label>
              </CardHeader>
              <CardContent className="pt-0">
                <PrivacyEditor
                  value={privacyJson}
                  onChange={setPrivacyJson}
                  userOptions={[]}
                  groupOptions={[]}
                  onRequestCreateGroup={requestCreateGroup} // ★ クリックでダイアログを要求
                />
              </CardContent>
            </Card>
          </div>

          {/* センシティブ設定 */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 backdrop-blur">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="crisisFlag"
                className="h-4 w-4"
                checked={crisisFlag}
                onChange={(e) => setCrisisFlag(e.target.checked)}
              />
              センシティブ
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex select-none items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-xs text-gray-600">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{crisisFlag ? 'ON' : 'OFF'}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                不適切な内容を含む可能性があるときに ON
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </div>

      {/* スティッキー投稿バー（ページ下部） */}
      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-20">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 p-2 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                可視性: {privacySummary}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                気分: {emoji || '未選択'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* 小さい円カウンタを再利用 */}
              <div className="relative h-7 w-7">
                <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r={circleR}
                    className="stroke-gray-200"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r={circleR}
                    strokeWidth="3"
                    fill="none"
                    className={
                      used > limit ? 'stroke-red-500' : 'stroke-blue-500'
                    }
                    strokeDasharray={`${dash} ${circleC}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-[10px] text-gray-500">
                  {left}
                </span>
              </div>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full"
                form="composeForm"
              >
                投稿する
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 新規グループ作成ダイアログ（見た目だけ担当） */}
      <CreateGroupDialog
        open={open}
        onOpenChange={(o) => (o ? setOpen(true) : handleClose())}
        name={name}
        onNameChange={(v) => {
          setName(v);
          if (error) setError('');
        }}
        error={error}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        users={[]}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
      />
    </main>
  );
}
