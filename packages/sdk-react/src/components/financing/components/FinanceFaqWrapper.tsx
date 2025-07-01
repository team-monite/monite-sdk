import { useState } from 'react';

import { Dialog } from '@/ui/Dialog';

import { FinanceFaqDetails } from './FinanceFaqDetails';

export const FinanceFaqWrapper = ({
  children,
}: {
  children: ({ openModal }: { openModal: () => void }) => React.ReactNode;
}) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const openModal = () => {
    setDialogIsOpen(true);
  };

  return (
    <>
      {children({ openModal })}

      <Dialog
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
        alignDialog="right"
      >
        <FinanceFaqDetails />
      </Dialog>
    </>
  );
};
