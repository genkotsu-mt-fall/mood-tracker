import { Info, Plus, ListChecks, GitMerge } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { PrivacySetting } from '@/lib/privacy/types'
import type { Option } from '@/lib/common/types'

type Props = {
  draft: PrivacySetting
  groupOptions: Option[]
  onHoverGroupChange?: (groupId: string | null) => void
  onRequestCreateGroup?: () => Promise<Option | void>
  commit: (next: PrivacySetting) => void
}

export default function GroupSection({
  draft,
  groupOptions,
  onHoverGroupChange,
  onRequestCreateGroup,
  commit,
}: Props) {
  // 配列トグル
  function toggleInArray<T>(arr: T[] | undefined, v: T): T[] {
    const a = arr ?? []
    return a.includes(v) ? a.filter((x) => x !== v) : [...a, v]
  }

  // ラジオID生成（ユニーク性は親で担保）
  const gmAnyId = 'gm-any'
  const gmAllId = 'gm-all'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 許可グループ */}
      <div>
        <div className="mb-1 text-xs text-gray-500">許可グループ</div>
        <ul className="w-full rounded-md border text-sm max-h-56 overflow-auto divide-y">
          {groupOptions.map((g) => {
            const checked = (draft.allow_groups ?? []).includes(g.id)
            return (
              <li
                key={g.id}
                className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-gray-50 transition"
                onMouseEnter={() => onHoverGroupChange?.(g.id)}
                onMouseLeave={() => onHoverGroupChange?.(null)}
                onFocus={() => onHoverGroupChange?.(g.id)}
                onBlur={() => onHoverGroupChange?.(null)}
                tabIndex={0}
                onClick={() =>
                  commit({ ...draft, allow_groups: toggleInArray(draft.allow_groups, g.id) })
                }
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={(e) =>
                    commit({
                      ...draft,
                      allow_groups: e.target.checked
                        ? [...(draft.allow_groups ?? []), g.id]
                        : (draft.allow_groups ?? []).filter((id) => id !== g.id),
                    })
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="truncate">{g.label}</span>
              </li>
            )
          })}

          {/* 「新しいグループを作成」→ 親にダイアログ要求 */}
          <li
            className="m-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 px-3 py-2 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
            onMouseEnter={() => onHoverGroupChange?.(null)}
            onMouseLeave={() => onHoverGroupChange?.(null)}
            onClick={async () => {
              if (!onRequestCreateGroup) return
              const created = await onRequestCreateGroup()
              if (created && 'id' in created && 'label' in created) {
                commit({
                  ...draft,
                  allow_groups: toggleInArray(draft.allow_groups, created.id),
                })
                onHoverGroupChange?.(created.id)
              }
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">新しいグループを作成</span>
          </li>
        </ul>
      </div>

      {/* グループ判定 */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-xs text-gray-500">グループ判定</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-muted"
                aria-label="any/all の違いについて"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              <p className="font-medium mb-1">any（どれか1つ所属）</p>
              <p className="mb-2">指定したグループのうち、いずれか1つに所属していればOK。</p>
              <p className="font-medium mb-1">all（全て所属）</p>
              <p>指定したグループすべてに所属している必要があります。</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <RadioGroup
          value={draft.group_visibility_mode ?? 'any'}
          onValueChange={(v) => commit({ ...draft, group_visibility_mode: v as 'any' | 'all' })}
          className="grid grid-cols-2 gap-3"
        >
          {/* any */}
          <Label htmlFor={gmAnyId} className="cursor-pointer">
            <RadioGroupItem id={gmAnyId} value="any" className="sr-only peer" />
            <div
              className="
                flex items-center gap-2 rounded-xl border p-3 text-sm
                transition-all hover:shadow-sm
                peer-data-[state=checked]:border-primary
                peer-data-[state=checked]:bg-primary/5
                peer-data-[state=checked]:ring-2
                peer-data-[state=checked]:ring-primary/30
              "
            >
              <ListChecks className="h-4 w-4" />
              <div>
                <div className="font-medium">any</div>
                <div className="text-xs text-muted-foreground">どれか1つ所属で可</div>
              </div>
            </div>
          </Label>

          {/* all */}
          <Label htmlFor={gmAllId} className="cursor-pointer">
            <RadioGroupItem id={gmAllId} value="all" className="sr-only peer" />
            <div
              className="
                flex items-center gap-2 rounded-xl border p-3 text-sm
                transition-all hover:shadow-sm
                peer-data-[state=checked]:border-primary
                peer-data-[state=checked]:bg-primary/5
                peer-data-[state=checked]:ring-2
                peer-data-[state=checked]:ring-primary/30
              "
            >
              <GitMerge className="h-4 w-4" />
              <div>
                <div className="font-medium">all</div>
                <div className="text-xs text-muted-foreground">すべて所属が必要</div>
              </div>
            </div>
          </Label>
        </RadioGroup>
      </div>
    </div>
  )
}
