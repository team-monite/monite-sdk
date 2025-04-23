import { useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  MenuItem,
  Button,
  Chip,
  useTheme,
  Typography,
} from '@mui/material';

import { useGetEntityBankAccounts } from '../hooks';

type Props = {
  disabled?: boolean;
  handleOpenBankModal: (id?: string) => void;
};

export const BankAccountSection = ({
  disabled,
  handleOpenBankModal,
}: Props) => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const { control } = useFormContext<CreateReceivablesFormProps>();
  const { data: bankAccounts } = useGetEntityBankAccounts();

  return (
    <RHFTextField
      fullWidth
      select
      name="entity_bank_account_id"
      control={control}
      label={t(i18n)`Receive payments to`}
      disabled={disabled}
      required
      sx={{
        display: 'flex',
        '& .MuiTypography-root': {
          width: 'auto',
          textOverflow: 'unset',
          whiteSpace: 'normal',
        },

        '& .MuiBox-root': {
          maxWidth: '100%',
        },
      }}
    >
      <Button
        variant="text"
        startIcon={<AddIcon />}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          px: 2,
        }}
        onClick={() => handleOpenBankModal()}
      >
        {t(i18n)`Add new bank account`}
      </Button>

      {bankAccounts &&
        bankAccounts?.data?.length > 0 &&
        bankAccounts?.data?.map(
          ({
            id,
            display_name,
            bank_name,
            currency,
            account_number,
            is_default_for_currency,
          }) => (
            <MenuItem
              key={id}
              value={id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  maxWidth: '60%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body1"
                  display="inline-block"
                  fontWeight={400}
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}
                >
                  {display_name && `${display_name} `}

                  <Typography component="span" color={theme.palette.grey[400]}>
                    {`${display_name && '|'} ${
                      bank_name && bank_name
                    } ****${account_number
                      ?.split('')
                      ?.slice(-4, undefined)
                      ?.join('')}, ${currency}`}
                  </Typography>
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                {is_default_for_currency && (
                  <Chip
                    label={t(i18n)`Default`}
                    sx={{
                      background: theme.palette.background.paper,
                      color: 'black',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                )}

                <Button
                  variant="text"
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenBankModal(id);
                  }}
                >
                  {t(i18n)`Edit`}
                </Button>
              </Box>
            </MenuItem>
          )
        )}
    </RHFTextField>
  );
};
