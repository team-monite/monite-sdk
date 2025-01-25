import { useCallback, useState } from 'react';

import { components } from '@/api';
import { CounterpartDetails } from '@/components';
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

const CardItem = ({
  title,
  description,
  type,
  onClick,
}: {
  title: string;
  description: string;
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
      }}
      onClick={handleClick}
    >
      <CardActionArea
        sx={{ height: '100%', display: 'flex', alignItems: 'start' }}
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
}: CreateCounterpartDialogProps) => {
  const { i18n } = useLingui();
  const [viewMode, setViewMode] = useState<View>(View.ChooseMode);
  const [counterpartType, setCounterpartType] = useState<
    components['schemas']['CounterpartType'] | undefined
  >(undefined);

  const handleCreateCounterpart = useCallback(
    (type: components['schemas']['CounterpartType']) => {
      setCounterpartType('individual');
      setViewMode(View.CounterpartCreationMode);
    },
    []
  );

  return (
    <>
      <Typography variant="h3" sx={{ p: 4 }}>{t(
        i18n
      )`Create customer`}</Typography>
      <Divider />
      <DialogContent>
        <CounterpartDetails
          type={'individual'}
          onCreate={() => {
            onClose();
          }}
        />
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
          <CardItem
            title={t(i18n)`Individual person`}
            description={t(
              i18n
            )`It is an entity having legal status as an individual.`}
            onClick={handleCreateCounterpart}
            type={'individual'}
          />
          <CardItem
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
    </>
  );
};
