'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';

export type MemberStatus = 'normal' | 'toAdd' | 'toRemove';

export type LastAction =
  | { kind: 'remove'; id: string; label: string }
  | { kind: 'add'; id: string; label: string }
  | { kind: 'undo'; id: string; label: string }
  | null;

function labelOf(u: UserResource): string {
  return u.name ?? u.email ?? u.id;
}

/** --- タイトル編集（draftだけ） --- */
type GroupNameDraftApi = {
  editable: boolean;
  draftName: string | null;
  setDraftName: (v: string | null) => void;
  reset: () => void;
};

/** --- メンバー編集（diffだけ） --- */
type MembersDraftApi = {
  editable: boolean;
  addedMembers: Map<string, UserResource>;
  removedIds: Set<string>;

  lastAction: LastAction;
  undoLast: () => void;

  addFromCandidate: (u: UserResource, baseIds: Set<string>) => void;
  removeById: (id: string, label: string, isBase: boolean) => void;
  undoById: (id: string, label: string) => void;

  statusOf: (id: string, baseIds: Set<string>) => MemberStatus;

  reset: () => void;
};

const GroupNameDraftContext = createContext<GroupNameDraftApi | null>(null);
const MembersDraftContext = createContext<MembersDraftApi | null>(null);

export function useGroupNameDraft(): GroupNameDraftApi {
  const ctx = useContext(GroupNameDraftContext);
  if (!ctx)
    throw new Error('useGroupNameDraft must be used within GroupEditProvider');
  return ctx;
}

export function useMembersDraft(): MembersDraftApi {
  const ctx = useContext(MembersDraftContext);
  if (!ctx)
    throw new Error('useMembersDraft must be used within GroupEditProvider');
  return ctx;
}

export function GroupEditProvider({
  editable,
  children,
}: {
  editable: boolean;
  children: ReactNode;
}) {
  // -------------------------
  // GroupName draft
  // -------------------------
  const [draftName, setDraftNameState] = useState<string | null>(null);

  const setDraftName = useCallback(
    (v: string | null) => {
      if (!editable) return;
      setDraftNameState(v);
    },
    [editable],
  );

  const resetName = useCallback(() => setDraftNameState(null), []);

  const nameApi = useMemo<GroupNameDraftApi>(
    () => ({
      editable,
      draftName,
      setDraftName,
      reset: resetName,
    }),
    [editable, draftName, setDraftName, resetName],
  );

  // -------------------------
  // Members diff
  // -------------------------
  const [addedMembers, setAddedMembers] = useState<Map<string, UserResource>>(
    () => new Map(),
  );
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());
  const [lastAction, setLastAction] = useState<LastAction>(null);

  const addFromCandidate = useCallback(
    (u: UserResource, baseIds: Set<string>) => {
      if (!editable) return;

      const id = u.id;
      const label = labelOf(u);

      // 削除予定なら「追加」は削除取消（Undo）として扱う
      if (removedIds.has(id)) {
        setRemovedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setLastAction({ kind: 'undo', id, label });
        return;
      }

      // baseにいるなら追加しない
      if (baseIds.has(id)) return;

      setAddedMembers((prev) => {
        const next = new Map(prev);
        next.set(id, u);
        return next;
      });
      setLastAction({ kind: 'add', id, label });
    },
    [editable, removedIds],
  );

  const removeById = useCallback(
    (id: string, label: string, isBase: boolean) => {
      if (!editable) return;

      // added（追加予定）なら削除＝追加取消
      if (!isBase) {
        setAddedMembers((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        setLastAction({ kind: 'undo', id, label });
        return;
      }

      // base（確定メンバー）なら削除予定へ
      setRemovedIds((prev) => new Set(prev).add(id));
      setLastAction({ kind: 'remove', id, label });
    },
    [editable],
  );

  const undoById = useCallback(
    (id: string, label: string) => {
      if (!editable) return;

      if (removedIds.has(id)) {
        setRemovedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setLastAction({ kind: 'undo', id, label });
        return;
      }

      if (addedMembers.has(id)) {
        setAddedMembers((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        setLastAction({ kind: 'undo', id, label });
      }
    },
    [editable, removedIds, addedMembers],
  );

  const undoLast = useCallback(() => {
    if (!lastAction) return;
    undoById(lastAction.id, lastAction.label);
  }, [lastAction, undoById]);

  const statusOf = useCallback(
    (id: string, baseIds: Set<string>): MemberStatus => {
      if (removedIds.has(id)) return 'toRemove';
      if (addedMembers.has(id) && !baseIds.has(id)) return 'toAdd';
      return 'normal';
    },
    [removedIds, addedMembers],
  );

  const resetMembers = useCallback(() => {
    setAddedMembers(new Map());
    setRemovedIds(new Set());
    setLastAction(null);
  }, []);

  const membersApi = useMemo<MembersDraftApi>(
    () => ({
      editable,
      addedMembers,
      removedIds,
      lastAction,
      undoLast,
      addFromCandidate,
      removeById,
      undoById,
      statusOf,
      reset: resetMembers,
    }),
    [
      editable,
      addedMembers,
      removedIds,
      lastAction,
      undoLast,
      addFromCandidate,
      removeById,
      undoById,
      statusOf,
      resetMembers,
    ],
  );

  return (
    <GroupNameDraftContext.Provider value={nameApi}>
      <MembersDraftContext.Provider value={membersApi}>
        {children}
      </MembersDraftContext.Provider>
    </GroupNameDraftContext.Provider>
  );
}
