import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DialogContent } from '@mui/material';

import { ManageMeasureUnitsForm } from '../ManageMeasureUnitsForm';

interface ManageMeasureUnitsProps {
  handleClose: () => void;
}

export const ManageMeasureUnits = ({
  handleClose,
}: ManageMeasureUnitsProps) => {
  const { i18n } = useLingui();
  return (
    <>
      <DialogHeader
        title={t(i18n)`Manage measure units`}
        closeButtonTooltip={t(i18n)`Close manage measure units`}
      />
      <DialogContent>
        <ManageMeasureUnitsForm />
      </DialogContent>
      <DialogFooter
        primaryButton={{
          label: t(i18n)`Done`,
          onClick: handleClose,
        }}
        cancelButton={{
          hideCancel: true,
        }}
      />
    </>
  );
};
