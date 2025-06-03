import { useRef, useCallback, RefObject } from 'react';

/**
 * Hook to manage blurring focus within a dialog before closing.
 *
 * Ensures that if the currently focused element is inside the dialog
 * when the close handler is called, it gets blurred to prevent focus
 * trapping in a hidden element (accessibility fix for aria-hidden warnings).
 *
 * @template T - The type of the HTML element the ref will be attached to (e.g., HTMLDivElement).
 * @template Args - Tuple type representing the arguments expected by the onClose function. Defaults to `[]`.
 * @param onClose The original function to call when the dialog should close.
 * @param onClose Optional callback function to be called after potential focus blurring.
 * @returns An object containing the `dialogRef` to attach to the dialog element and the memoized `handleClose` function.
 */
export function useHandleDialogCloseFocus<
  T extends HTMLElement,
  Args extends any[] = []
>(
  onClose?: (...args: Args) => void
): {
  dialogRef: RefObject<T>;
  handleClose: (...args: Args) => void;
} {
  const dialogRef = useRef<T>(null);

  const handleClose = useCallback(
    (...args: Args) => {
      if (typeof document === 'undefined') {
        onClose?.(...args);
        return;
      }

      const elementToBlur = document.activeElement;

      if (
        dialogRef.current &&
        elementToBlur instanceof HTMLElement &&
        dialogRef.current.contains(elementToBlur)
      ) {
        elementToBlur.blur();
      }

      onClose?.(...args);
    },
    [onClose]
  );

  return { dialogRef, handleClose };
}
