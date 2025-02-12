import { useState, useCallback, useMemo, useEffect } from 'react';
import { Controller, Control, useFormContext } from 'react-hook-form';

import { getCounterpartName } from '@/components/counterparts/helpers';
import { CreateCounterpartDialog } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateCounterpartDialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  CircularProgress,
  TextField,
  FormHelperText,
  createFilterOptions,
  Button,
} from '@mui/material';

import type { FormValues } from '../ApprovalPolicyForm';

interface AutocompleteCreatedByProps {
  control: Control<FormValues>;
  name: 'triggers.counterpart_id';
  label: string;
}

export interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

export const AutocompleteCounterparts = ({
  control,
  name,
  label,
}: AutocompleteCreatedByProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();
  const { setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [newCounterpartId, setNewCounterpartId] = useState<string | null>(null);

  const handleCreateNewCounterpart = useCallback(() => {
    setIsCreateCounterpartOpened(true);
  }, [setIsCreateCounterpartOpened]);

  const {
    data: counterparts,
    isLoading: isCounterpartsLoading,
    refetch,
  } = api.counterparts.getCounterparts.useQuery({
    query: {
      ...(inputValue && { counterpart_name__icontains: inputValue }),
    },
  });

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

  const filter = createFilterOptions<CounterpartsAutocompleteOptionProps>();

  const COUNTERPART_CREATE_NEW_ID = '__create-new__';

  function isCreateNewCounterpartOption(
    counterpartOption: CounterpartsAutocompleteOptionProps | undefined | null
  ): boolean {
    return counterpartOption?.id === COUNTERPART_CREATE_NEW_ID;
  }

  useEffect(() => {
    if (newCounterpartId) {
      const currentValues = getValues(name) || [];

      const isAlreadyAdded = currentValues.some(
        (counterpart: CounterpartsAutocompleteOptionProps) =>
          counterpart.id === newCounterpartId
      );

      if (!isAlreadyAdded) {
        const existingCounterpart = counterpartsAutocompleteData.find(
          (counterpart) => counterpart.id === newCounterpartId
        );

        const newCounterpart = {
          id: newCounterpartId,
          label: existingCounterpart
            ? existingCounterpart.label
            : 'New Counterpart',
        };

        setValue(name, [...currentValues, newCounterpart]);
      }
    }
  }, [
    newCounterpartId,
    setValue,
    name,
    getValues,
    counterpartsAutocompleteData,
  ]);

  return (
    <>
      <CreateCounterpartDialog
        open={isCreateCounterpartOpened}
        onClose={() => {
          setIsCreateCounterpartOpened(false);
        }}
        onCreate={setNewCounterpartId}
      />
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <Autocomplete
              {...field}
              value={Array.isArray(field.value) ? field.value : []}
              id={field.name}
              multiple
              autoComplete
              includeInputInList
              filterSelectedOptions
              noOptionsText={t(i18n)`No users found`}
              slotProps={{
                popper: {
                  container: root,
                },
              }}
              loading={isCounterpartsLoading}
              options={counterpartsAutocompleteData}
              getOptionLabel={(counterpartOption) =>
                isCreateNewCounterpartOption(counterpartOption)
                  ? ''
                  : counterpartOption.label
              }
              getOptionKey={(option) => option.id}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                filtered.unshift({
                  id: COUNTERPART_CREATE_NEW_ID,
                  label: t(i18n)`Create new counterpart`,
                });

                return filtered;
              }}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              onChange={(_, value) => {
                setValue(name, value);
                refetch();
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={!!error}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isCounterpartsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, counterpartOption) => {
                return isCreateNewCounterpartOption(counterpartOption) ? (
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
                );
              }}
            />
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </>
        )}
      />
    </>
  );
};
