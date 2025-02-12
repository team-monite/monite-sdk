import { useCallback, useMemo, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/Counterpart.types';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { CreateCounterpartDialog } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateCounterpartDialog';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCounterpartList } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  createFilterOptions,
} from '@mui/material';

interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

const filter = createFilterOptions<CounterpartsAutocompleteOptionProps>();

const COUNTERPART_CREATE_NEW_ID = '__create-new__';

function isCreateNewCounterpartOption(
  counterpartOption: CounterpartsAutocompleteOptionProps | undefined | null
): boolean {
  return counterpartOption?.id === COUNTERPART_CREATE_NEW_ID;
}

export const CounterpartAutocompleteWithCreate = ({
  disabled,
  name,
  label = 'Customer',
  getCounterpartDefaultValues,
  required = true,
}: {
  disabled?: boolean;
  name: string;
  label: string;
  getCounterpartDefaultValues?: (
    type?: string
  ) => DefaultValuesOCRIndividual | DefaultValuesOCROrganization;
  required?: boolean;
}) => {
  const { i18n } = useLingui();
  const { control, setValue } = useFormContext<any>();

  const { root } = useRootElements();

  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList();

  const counterpartsAutocompleteData = useMemo<
    Array<CounterpartsAutocompleteOptionProps>
  >(
    () =>
      counterparts
        ? counterparts?.data.map((counterpart) => ({
            id: counterpart.id,
            label: getCounterpartName(counterpart),
          }))
        : [],
    [counterparts]
  );

  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);

  const handleCreateNewCounterpart = useCallback(() => {
    setIsCreateCounterpartOpened(true);
  }, [setIsCreateCounterpartOpened]);

  const [newCounterpartId, setNewCounterpartId] = useState<string | null>(null);

  useEffect(() => {
    if (newCounterpartId) {
      setValue(name, newCounterpartId);
    }
  }, [newCounterpartId, setValue, name]);

  return (
    <>
      <CreateCounterpartDialog
        open={isCreateCounterpartOpened}
        onClose={() => {
          setIsCreateCounterpartOpened(false);
        }}
        onCreate={setNewCounterpartId}
        getCounterpartDefaultValues={getCounterpartDefaultValues}
      />
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const selectedCounterpart = counterparts?.data.find(
            (counterpart) => counterpart.id === field.value
          );

          /**
           * We have to set `selectedCounterpartOption` to `null`
           *  if `selectedCounterpart` is `null` because
           *  `Autocomplete` component doesn't work with `undefined`
           */
          const selectedCounterpartOption = selectedCounterpart
            ? {
                id: selectedCounterpart.id,
                label: getCounterpartName(selectedCounterpart),
              }
            : null;

          return (
            <Autocomplete
              {...field}
              value={selectedCounterpartOption}
              onChange={(_, value) => {
                if (isCreateNewCounterpartOption(value)) {
                  field.onChange(null);

                  return;
                }

                field.onChange(value?.id);
              }}
              slotProps={{
                popper: {
                  container: root,
                },
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                filtered.unshift({
                  id: COUNTERPART_CREATE_NEW_ID,
                  label: t(i18n)`Create new counterpart`,
                });

                return filtered;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t(i18n)`${label}`}
                  placeholder={t(i18n)`Select counterpart`}
                  required={required}
                  error={Boolean(error)}
                  helperText={error?.message}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: isCounterpartsLoading ? (
                      <CircularProgress size={20} />
                    ) : null,
                  }}
                />
              )}
              loading={isCounterpartsLoading || disabled}
              options={counterpartsAutocompleteData}
              getOptionLabel={(counterpartOption) =>
                isCreateNewCounterpartOption(counterpartOption)
                  ? ''
                  : counterpartOption.label
              }
              isOptionEqualToValue={(option, value) => {
                return option.id === value.id;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, counterpartOption) =>
                isCreateNewCounterpartOption(counterpartOption) ? (
                  <Button
                    key={counterpartOption.id}
                    variant="text"
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2,
                    }}
                    onClick={handleCreateNewCounterpart}
                  >
                    {counterpartOption.label}
                  </Button>
                ) : (
                  <li {...props} key={counterpartOption.id}>
                    {counterpartOption.label}
                  </li>
                )
              }
            />
          );
        }}
      />
    </>
  );
};
