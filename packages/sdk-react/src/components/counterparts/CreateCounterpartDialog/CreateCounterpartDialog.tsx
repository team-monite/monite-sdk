import { useCallback, useState } from 'react';

import { components } from '@/api';
import { CounterpartDetails } from '@/components';
import {
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/Counterpart.types';
import { Dialog } from '@/components/Dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
} from '@mui/material';

import { CreateCounterpartDialogTestEnum } from './CreateCounterpartDialog.types';

interface CreateCounterpartDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (id: string) => void;
  getCounterpartDefaultValues?: (
    type?: string
  ) => DefaultValuesOCRIndividual | DefaultValuesOCROrganization;
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

export const CounterpartTypeItem = ({
  description,
  isTypeSelected,
  title,
  type,
  onClick,
}: {
  description: string;
  isTypeSelected?: boolean;
  title: string;
  type: components['schemas']['CounterpartType'];
  onClick: (type: components['schemas']['CounterpartType']) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(type);
  }, [onClick, type]);

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: 'pointer',
        border: 'none',
      }}
      onClick={handleClick}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          alignItems: 'start',
          bgcolor: isTypeSelected
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(0, 0, 0, 0.02)',
          borderColor: 'transparent',
        }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const CreateCounterpartDialog = ({
  open,
  onClose,
  onCreate,
  getCounterpartDefaultValues,
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
        />
      </Dialog>
    );
  }

  return (
    <Dialog
      alignDialog="right"
      open={open}
      onClose={onClose}
      data-testid={CreateCounterpartDialogTestEnum.DataTestId}
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
        <Button variant="outlined" onClick={onClose}>
          {t(i18n)`Cancel`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
