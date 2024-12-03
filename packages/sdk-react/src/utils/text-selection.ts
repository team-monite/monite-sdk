export function hasSelectedText(): boolean {
  const selection = window.getSelection();
  return !!selection && !!selection.toString();
}
