import { useId, useMemo, useState } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import { ManageMeasureUnitsForm } from '../ManageMeasureUnitsForm';

export const ManageMeasureUnits = ({ handleClose }) => {
  const { i18n } = useLingui();
  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={11}>
          <Typography sx={{ p: 3 }}>{t(i18n)`Manage measure units`}</Typography>
        </Grid>
      </Grid>
      <Divider />
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
