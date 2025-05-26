import { useCallback, useState } from 'react';

import { components } from '@/api';
import {
  CustomerTypes,
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
} from '@mui/material';

import { Dialog } from '../../Dialog/Dialog';
import { CounterpartDetails } from '../CounterpartDetails/CounterpartDetails';
import { CounterpartTypeItem } from './CounterpartTypeItem';

interface CreateCounterpartDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (id: string) => void;
  getCounterpartDefaultValues?: (
    type?: string
  ) => DefaultValuesOCRIndividual | DefaultValuesOCROrganization;
  customerTypes?: CustomerTypes;
}

enum View {
  /**
   * Mode, when the user has to select
   *  which counterpart type they want to create
   */
  ChooseMode = 'choose-mode',

  /**
   * Mode, when the user has to fill
   *  in the details of the counterpart
   */
  CounterpartCreationMode = 'counterpart-creation-mode',
}

export const CreateCounterpartDialog = ({
  open,
  onClose,
  onCreate,
  getCounterpartDefaultValues,
  customerTypes,
}: CreateCounterpartDialogProps) => {
  const { i18n } = useLingui();
  const [viewMode, setViewMode] = useState<View>(View.ChooseMode);
  const [counterpartType, setCounterpartType] = useState<
    components['schemas']['CounterpartType'] | undefined
  >(undefined);

  const handleCreateCounterpart = useCallback(
    (type: components['schemas']['CounterpartType']) => {
      setCounterpartType(type);
      setViewMode(View.CounterpartCreationMode);
    },
    []
  );

  const defaultValuesOCR = getCounterpartDefaultValues?.(counterpartType);

  if (viewMode === View.CounterpartCreationMode && counterpartType) {
    return (
      <Dialog
        alignDialog="right"
        data-testid="create-counterpart-dialog"
        open={open}
        onClose={() => {
          setViewMode(View.ChooseMode);
          setCounterpartType(undefined);
          onClose();
        }}
      >
        <CounterpartDetails
          defaultValuesOCR={defaultValuesOCR}
          type={counterpartType}
          onCreate={(id: string) => {
            onCreate(id);
            setViewMode(View.ChooseMode);
            setCounterpartType(undefined);
            onClose();
          }}
          customerTypes={customerTypes}
        />
      </Dialog>
    );
  }

  return (
    <Dialog
      alignDialog="right"
      open={open}
      onClose={onClose}
      data-testid="create-counterpart-dialog"
    >
      <Typography variant="h3" sx={{ p: 4 }}>{t(
        i18n
      )`Create counterpart`}</Typography>
      <Divider />
      <DialogContent>
        <Typography sx={{ mb: 2, fontWeight: 500 }}>{t(
          i18n
        )`Choose counterpart type:`}</Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          <CounterpartTypeItem
            title={t(i18n)`Individual person`}
            description={t(
              i18n
            )`It is an entity having legal status as an individual.`}
            onClick={handleCreateCounterpart}
            type={'individual'}
          />
          <CounterpartTypeItem
            title={t(i18n)`Organization`}
            description={t(
              i18n
            )`It is a non-human legal entity, i.e. an organisation recognised by law as a legal person.`}
            onClick={handleCreateCounterpart}
            type={'organization'}
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          {t(i18n)`Cancel`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
