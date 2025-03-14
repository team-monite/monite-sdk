import { useCallback, useState } from 'react';

import { components } from '@/api';
import { CounterpartDetails } from '@/components';
import { CounterpartTypeItem } from '@/components/counterparts/CreateCounterpartDialog/CreateCounterpartDialog';
import { useRootElements } from '@/core/context/RootElementsProvider/RootElementsProvider';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Grid,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CreateCounterpartModalTestEnum } from './CreateCounterpartModal.types';

interface CreateCounterpartModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newCounterpartId: string) => void;
}

export const CreateCounterpartModal = ({
  open,
  onClose,
  onCreate,
}: CreateCounterpartModalProps) => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const { root } = useRootElements();
  const [counterpartType, setCounterpartType] = useState<
    components['schemas']['CounterpartType'] | undefined
  >(undefined);
  const handleClose = useCallback(() => {
    setCounterpartType(undefined);
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      container={root}
      data-testid={CreateCounterpartModalTestEnum.DataTestId}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 8,
        }}
      >
        {counterpartType ? (
          <Grid
            sx={{
              maxHeight: isLargeScreen ? 920 : 720,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CounterpartDetails
              type={counterpartType}
              isInvoiceCreation={true}
              onClose={handleClose}
              onReturn={() => setCounterpartType(undefined)}
              onCreate={(counterpartId) => {
                onCreate(counterpartId);
                onClose();
              }}
            />
          </Grid>
        ) : (
          <Grid container alignItems="center" p={4}>
            <Grid item xs={11} mb={4}>
              <Typography variant="h3">{t(i18n)`Create customer`}</Typography>
            </Grid>
            <Grid item xs={1} mb={4}>
              <IconWrapper
                aria-label={t(i18n)`Counterpart Close`}
                onClick={handleClose}
                color="default"
              >
                <CloseIcon />
              </IconWrapper>
            </Grid>
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
                onClick={() => setCounterpartType('individual')}
                type={'individual'}
                isTypeSelected={counterpartType === 'individual'}
              />
              <CounterpartTypeItem
                title={t(i18n)`Organization`}
                description={t(
                  i18n
                )`It is a non-human legal entity, i.e. an organisation recognised by law as a legal person.`}
                onClick={() => setCounterpartType('organization')}
                type={'organization'}
                isTypeSelected={counterpartType === 'organization'}
              />
            </Box>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};
