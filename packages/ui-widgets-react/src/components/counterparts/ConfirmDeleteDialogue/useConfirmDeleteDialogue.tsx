import { useCallback, useState } from 'react';

export function useConfirmDeleteDialogue() {
  const [isDialogueOpen, setDialogueOpen] = useState(false);

  const showDialogue = useCallback(async () => {
    setDialogueOpen(true);
  }, []);

  const hideDialogue = useCallback(async () => {
    setDialogueOpen(false);
  }, []);

  return {
    showDialogue,
    hideDialogue,
    isDialogueOpen,
  };
}
