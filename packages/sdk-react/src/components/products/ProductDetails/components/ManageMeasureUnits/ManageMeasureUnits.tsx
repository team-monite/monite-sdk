import { DialogHeader } from '@/ui/DialogHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, DialogActions, DialogContent, Divider } from '@mui/material';

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
      <Divider />
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          {t(i18n)`Done`}
        </Button>
      </DialogActions>
    </>
  );
};
