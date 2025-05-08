import { useCallback, useState } from 'react';

import { components } from '@/api';
import { CounterpartDetails } from '@/components';
import { CounterpartTypeItem } from '@/components/counterparts/components';
import {
  CustomerTypes,
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/types';
import { useRootElements } from '@/core/context/RootElementsProvider/RootElementsProvider';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Modal, Typography } from '@mui/material';

interface CreateCounterpartModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newCounterpartId: string) => void;
  customerTypes?: CustomerTypes;
  isInvoiceCreation?: boolean;
  getCounterpartDefaultValues?: (
    type?: string
  ) => DefaultValuesOCRIndividual | DefaultValuesOCROrganization;
}

export const CreateCounterpartModal = ({
  open,
  onClose,
  onCreate,
  customerTypes,
  isInvoiceCreation,
  getCounterpartDefaultValues,
}: CreateCounterpartModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const [counterpartType, setCounterpartType] = useState<
    components['schemas']['CounterpartType'] | undefined
  >(undefined);

  const defaultValuesOCR = getCounterpartDefaultValues?.(counterpartType);

  const handleClose = useCallback(() => {
    setCounterpartType(undefined);
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      container={root}
      data-testid="create-counterpart-modal"
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
          borderRadius: 2,
          maxHeight: '90%',
        }}
      >
        {counterpartType ? (
          <CounterpartDetails
            type={counterpartType}
            customerTypes={customerTypes}
            isInvoiceCreation={isInvoiceCreation}
            onClose={handleClose}
            onReturn={() => setCounterpartType(undefined)}
            onCreate={(counterpartId) => {
              onCreate(counterpartId);
              onClose();
            }}
            defaultValuesOCR={defaultValuesOCR}
            defaultValues={{
              isCustomer: customerTypes?.includes('customer'),
              isVendor: customerTypes?.includes('vendor'),
            }}
          />
        ) : (
          <Grid container alignItems="center" p={4}>
            <Grid item xs={11} mb={4}>
              <Typography variant="h3">{t(
                i18n
              )`Create counterpart`}</Typography>
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
                type="individual"
                isTypeSelected={counterpartType === 'individual'}
              />
              <CounterpartTypeItem
                title={t(i18n)`Organization`}
                description={t(
                  i18n
                )`It is a non-human legal entity, i.e. an organisation recognised by law as a legal person.`}
                onClick={() => setCounterpartType('organization')}
                type="organization"
                isTypeSelected={counterpartType === 'organization'}
              />
            </Box>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};
