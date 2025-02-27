import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Controller,
  Control,
  useFormContext,
  FieldValues,
  FieldPath,
  PathValue,
} from 'react-hook-form';

import type {
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/Counterpart.types';
import { CreateCounterpartDialog } from '@/components/counterparts/CreateCounterpartDialog';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCounterpartList } from '@/core/queries';
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

export interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

const COUNTERPART_CREATE_NEW_ID = '__create-new__';

const filter = createFilterOptions<CounterpartsAutocompleteOptionProps>();

function isCreateNewCounterpartOption(
  counterpartOption: CounterpartsAutocompleteOptionProps | undefined | null
): boolean {
  return counterpartOption?.id === COUNTERPART_CREATE_NEW_ID;
}

interface CounterpartAutocompleteProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  getCounterpartDefaultValues?: (
    type?: string
  ) => DefaultValuesOCRIndividual | DefaultValuesOCROrganization;
  multiple?: boolean;
}

export const CounterpartAutocomplete = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required = true,
  getCounterpartDefaultValues,
  multiple = false,
  disabled = false,
}: CounterpartAutocompleteProps<TFieldValues>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { setValue, getValues } = useFormContext<TFieldValues>();
  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [newCounterpartId, setNewCounterpartId] = useState<string | null>(null);

  const handleCreateNewCounterpart = useCallback(() => {
    setIsCreateCounterpartOpened(true);
  }, [setIsCreateCounterpartOpened]);

  const handleCloseCreateCounterpart = useCallback(() => {
    setIsCreateCounterpartOpened(false);
  }, [setIsCreateCounterpartOpened]);

  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList();

  const counterpartsAutocompleteData = useMemo<
    Array<CounterpartsAutocompleteOptionProps>
  >(
    () =>
      counterparts?.data.map((counterpart) => ({
        id: counterpart.id,
        label: getCounterpartName(counterpart),
      })) ?? [],
    [counterparts]
  );

  const newCounterpartDefaultLabel = t(i18n)`New counterpart`;

  useEffect(() => {
    if (newCounterpartId) {
      const currentValues = getValues(name);
      if (multiple) {
        const values = currentValues ? currentValues : [];
        const isAlreadyAdded = (
          values as Array<CounterpartsAutocompleteOptionProps>
        )?.some((counterpart) => counterpart.id === newCounterpartId);

        if (!isAlreadyAdded) {
          const existingCounterpart = counterpartsAutocompleteData.find(
            (counterpart) => counterpart.id === newCounterpartId
          );

          const newCounterpart = {
            id: newCounterpartId,
            label: existingCounterpart
              ? existingCounterpart.label
              : newCounterpartDefaultLabel,
          };

          setValue(name, [
            ...(values as Array<CounterpartsAutocompleteOptionProps>),
            newCounterpart,
          ] as PathValue<TFieldValues, FieldPath<TFieldValues>>);
        }
      } else {
        setValue(
          name,
          newCounterpartId as PathValue<TFieldValues, FieldPath<TFieldValues>>
        );
      }
    }
  }, [
    newCounterpartId,
    setValue,
    name,
    getValues,
    counterpartsAutocompleteData,
    multiple,
    newCounterpartDefaultLabel,
  ]);

  return (
    <>
      <CreateCounterpartDialog
        open={isCreateCounterpartOpened}
        onClose={handleCloseCreateCounterpart}
        onCreate={setNewCounterpartId}
        getCounterpartDefaultValues={getCounterpartDefaultValues}
      />
      <Controller
        control={control}
        name={name}
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
            <>
              <Autocomplete
                {...field}
                value={
                  multiple
                    ? Array.isArray(field.value)
                      ? field.value
                      : []
                    : selectedCounterpartOption || null
                }
                id={field.name}
                multiple={multiple}
                autoComplete
                includeInputInList
                disabled={disabled}
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
                onChange={(_, value) => {
                  if (multiple) {
                    setValue(
                      name,
                      value as PathValue<TFieldValues, FieldPath<TFieldValues>>
                    );
                  } else {
                    setValue(
                      name,
                      (value as CounterpartsAutocompleteOptionProps | null)
                        ?.id as PathValue<TFieldValues, FieldPath<TFieldValues>>
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    error={!!error}
                    required={required}
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
          );
        }}
      />
    </>
  );
};
