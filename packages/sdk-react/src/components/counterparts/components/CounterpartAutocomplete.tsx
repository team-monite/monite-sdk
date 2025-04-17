import { useState, useMemo, useEffect } from 'react';
import {
  Controller,
  Control,
  useFormContext,
  FieldValues,
  FieldPath,
  PathValue,
} from 'react-hook-form';

import { CreateCounterpartModal } from '@/components/counterparts/components';
import { getCounterpartName } from '@/components/counterparts/helpers';
import type {
  CustomerTypes,
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
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
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

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
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
  isCounterpartMatchingToOCRFound?: boolean;
  counterpartRawName?: string;
}

export const CounterpartAutocomplete = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required = true,
  getCounterpartDefaultValues,
  multiple = false,
  disabled = false,
  customerTypes,
  isCounterpartMatchingToOCRFound,
  counterpartRawName,
}: CounterpartAutocompleteProps<TFieldValues>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { componentSettings } = useMoniteContext();
  const { setValue, getValues } = useFormContext<TFieldValues>();
  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [newCounterpartId, setNewCounterpartId] = useState<string | null>(null);

  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList({ query: { is_vendor: true } });

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
              : t(i18n)`New counterpart`,
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
    i18n,
  ]);

  return (
    <>
      <CreateCounterpartModal
        open={isCreateCounterpartOpened}
        onClose={() => setIsCreateCounterpartOpened(false)}
        onCreate={setNewCounterpartId}
        getCounterpartDefaultValues={getCounterpartDefaultValues}
        customerTypes={
          customerTypes || componentSettings?.counterparts?.customerTypes
        }
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
                    : selectedCounterpartOption
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
                  <>
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
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                    {!isCounterpartMatchingToOCRFound &&
                      counterpartRawName &&
                      !getValues(name) && (
                        <FormHelperText>
                          {t(
                            i18n
                          )`The specified counterpart has not been saved yet.`}
                          <br />
                          {t(i18n)`Create new counterpart:`}
                          <StyledButtonLink
                            as="button"
                            sx={{ marginLeft: 0.5 }}
                            onClick={() => setIsCreateCounterpartOpened(true)}
                          >
                            {counterpartRawName}
                          </StyledButtonLink>
                        </FormHelperText>
                      )}
                  </>
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
                      onClick={() => setIsCreateCounterpartOpened(true)}
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
            </>
          );
        }}
      />
    </>
  );
};

const StyledButtonLink = styled(Link)(({ theme }) => ({
  all: 'unset',
  cursor: 'pointer',
  color: theme.palette.primary.main,
  textDecoration: 'underline',
}));
