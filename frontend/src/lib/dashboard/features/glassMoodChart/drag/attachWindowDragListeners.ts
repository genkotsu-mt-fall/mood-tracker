export type WindowDragHandlers = {
  onWindowMove: (ev: MouseEvent | TouchEvent) => void;
  onWindowUp: () => void;
};

/**
 * window にドラッグ用 listener を登録し、解除関数を返す。
 * removeEventListener は「同じ関数参照」でないと外れないため、
 * ここで受け取った handlers をそのまま remove にも使う。
 */
export function attachWindowDragListeners(handlers: WindowDragHandlers) {
  const { onWindowMove, onWindowUp } = handlers;

  window.addEventListener('mousemove', onWindowMove, true);
  window.addEventListener('mouseup', onWindowUp, true);

  window.addEventListener(
    'touchmove',
    onWindowMove as unknown as EventListener,
    { capture: true, passive: false },
  );
  window.addEventListener('touchend', onWindowUp as unknown as EventListener, {
    capture: true,
  });

  // 解除関数（登録時と同じ参照を使う）
  return function detachWindowDragListeners() {
    window.removeEventListener('mousemove', onWindowMove, true);
    window.removeEventListener('mouseup', onWindowUp, true);

    // remove は capture の一致が重要。add が capture:true なので remove も true/capture:true。
    window.removeEventListener(
      'touchmove',
      onWindowMove as unknown as EventListener,
      true,
    );
    window.removeEventListener(
      'touchend',
      onWindowUp as unknown as EventListener,
      true,
    );
  };
}
