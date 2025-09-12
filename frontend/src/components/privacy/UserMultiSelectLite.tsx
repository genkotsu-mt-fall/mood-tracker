"use client"

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronsUpDown, Check, X, Plus } from 'lucide-react'

/** この最低限の形を満たせば何でも渡せる */
export type WithIdLabel = { id: string; label: string }

type Props<T extends WithIdLabel> = {
  options: T[]
  value: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
  previewChips?: number
  accent?: 'allow' | 'deny'
  /** Option型にavatarUrlが無い場合の取得関数（任意） */
  getAvatarUrl?: (item: T) => string | undefined
}

export default function UserMultiSelectLite<T extends WithIdLabel>({
  options,
  value,
  onChange,
  placeholder = 'ユーザーを検索…',
  previewChips = 3,
  accent = 'allow',
  getAvatarUrl,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const byId = useMemo(() => new Map(options.map((o) => [o.id, o])), [options])
  const selected = useMemo(() => value.map((id) => byId.get(id)).filter(Boolean) as T[], [value, byId])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return options
    return options.filter((o) => o.label.toLowerCase().includes(t))
  }, [q, options])

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

  const clear = () => onChange([])
  const selectAll = () => onChange(filtered.map((o) => o.id))
  const rest = Math.max(0, selected.length - previewChips)
  const initials = (name: string) => name.trim().slice(0, 2).toUpperCase()

  const accentChip =
    accent === 'allow'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-rose-50 text-rose-700 border-rose-200'

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex min-w-0 items-center gap-2">
              {selected.slice(0, previewChips).map((u) => (
                <Badge
                  key={u.id}
                  variant="outline"
                  className={`max-w-[9rem] overflow-hidden text-ellipsis ${accentChip}`}
                >
                  {u.label}
                </Badge>
              ))}
              {rest > 0 && <Badge variant="secondary">+{rest}</Badge>}
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[28rem] p-0" align="start">
          <div className="p-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div>
                選択中{' '}
                <span className={accent === 'allow' ? 'text-green-700' : 'text-rose-700'}>
                  {selected.length}
                </span>{' '}
                / {options.length}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={selectAll}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  全選択
                </Button>
                <Button size="sm" variant="ghost" onClick={clear}>
                  <X className="mr-1 h-3.5 w-3.5" />
                  クリア
                </Button>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border px-2 py-1 text-sm"
              />
            </div>
          </div>
          <Separator />

          <div className="max-h-[18rem] overflow-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-sm text-muted-foreground">一致するユーザーがいません</p>
            ) : (
              <ul className="divide-y">
                {filtered.map((o) => {
                  const checked = value.includes(o.id)
                  const avatarUrl = getAvatarUrl ? getAvatarUrl(o) : undefined
                  return (
                    <li key={o.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/40">
                      <label className="flex w-full cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={() => toggle(o.id)}
                        />
                        <Avatar className="h-6 w-6">
                          {avatarUrl ? <AvatarImage src={avatarUrl} alt={o.label} /> : null}
                          <AvatarFallback>{initials(o.label)}</AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate text-sm">{o.label}</span>
                        {checked && <Check className="h-4 w-4 opacity-60" />}
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((u) => (
            <Badge key={u.id} variant="outline" className={accentChip}>
              <span className="mr-1">{u.label}</span>
              <button
                className="ml-1 rounded p-0.5 hover:bg-black/5"
                aria-label={`${u.label} を外す`}
                onClick={() => toggle(u.id)}
              >
                <X className="h-3.5 w-3.5 opacity-70" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
