import { Controller, useFormContext } from 'react-hook-form';

import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMyEntity } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  MenuItem,
  FormHelperText,
  TextField,
  Collapse,
  Box,
} from '@mui/material';

export const YourVatDetailsForm = ({ disabled }: { disabled: boolean }) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();

  const { api, monite } = useMoniteContext();
  const { data: entityVatIds, isLoading: isEntityVatIdsLoading } =
    api.entities.getEntitiesIdVatIds.useQuery({
      path: { entity_id: monite.entityId },
    });

  const {
    data: entity,
    isLoading: isEntityLoading,
    isNonVatSupported,
  } = useMyEntity();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {!isNonVatSupported && (
        <Controller
          name="entity_vat_id_id"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl
              variant="outlined"
              fullWidth
              required
              disabled={isEntityVatIdsLoading || disabled}
              error={Boolean(error)}
            >
              <InputLabel id={field.name}>{t(i18n)`Your VAT ID`}</InputLabel>
              <Select
                {...field}
                labelId={field.name}
                label={t(i18n)`Your VAT ID`}
                MenuProps={{ container: root }}
                startAdornment={
                  isEntityVatIdsLoading ? (
                    <CircularProgress size={20} />
                  ) : entity?.address.country ? (
                    <CountryInvoiceOption code={entity.address.country} />
                  ) : null
                }
              >
                {entityVatIds?.data.map((vatId) => (
                  <MenuItem key={vatId.id} value={vatId.id}>
                    {vatId.value}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <TextField
        disabled
        fullWidth
        variant="outlined"
        label={t(i18n)`Your Tax ID`}
        value={entity?.tax_id ?? ''}
        InputProps={{
          startAdornment: isEntityLoading ? (
            <CircularProgress size={20} />
          ) : entity?.address.country ? (
            <CountryInvoiceOption code={entity.address.country} />
          ) : null,
        }}
      />
      <Collapse in={Boolean(!entity?.tax_id) && !isEntityLoading}>
        <FormHelperText>{t(i18n)`No Tax ID available`}</FormHelperText>
      </Collapse>
    </Box>
  );
};
