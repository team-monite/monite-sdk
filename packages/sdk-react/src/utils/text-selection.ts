export function hasSelectedText(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const selection = window.getSelection();
  return !!selection && !!selection.toString();
}
