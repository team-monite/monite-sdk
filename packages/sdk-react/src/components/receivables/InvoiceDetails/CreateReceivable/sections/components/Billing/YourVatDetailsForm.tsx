import { useEffect } from 'react';
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
  const { control, setValue } = useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();

  const { api, entityId } = useMoniteContext();
  const { data: entityVatIds, isLoading: isEntityVatIdsLoading } =
    api.entities.getEntitiesIdVatIds.useQuery({
      path: { entity_id: entityId },
    });

  const {
    data: entity,
    isLoading: isEntityLoading,
    isNonVatSupported,
    isNonCompliantFlow,
  } = useMyEntity();

  const showEntityVatIdField =
    !isNonVatSupported &&
    !(
      isNonCompliantFlow &&
      entityVatIds?.data &&
      entityVatIds.data.length === 0
    );

  const isHiddenForUS =
    entity?.address.country && entity?.address.country === 'US';

  useEffect(() => {
    if (entityVatIds && entityVatIds.data.length === 1) {
      setValue('entity_vat_id_id', entityVatIds.data[0].id);
    }
  }, [entityVatIds]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {showEntityVatIdField && (
        <Controller
          name="entity_vat_id_id"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl
              variant="standard"
              fullWidth
              required={!isNonCompliantFlow && !isHiddenForUS}
              hidden={isHiddenForUS}
              disabled={
                isEntityVatIdsLoading ||
                disabled ||
                entityVatIds?.data.length === 1
              }
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
        hidden={isHiddenForUS}
        variant="standard"
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
      {!isHiddenForUS && (
        <Collapse in={Boolean(!entity?.tax_id) && !isEntityLoading}>
          <FormHelperText>{t(i18n)`No Tax ID available`}</FormHelperText>
        </Collapse>
      )}
    </Box>
  );
};
