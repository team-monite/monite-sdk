import { useState, useMemo, useEffect, SetStateAction } from 'react';
import {
  Controller,
  Control,
  useFormContext,
  FieldValues,
  FieldPath,
  PathValue,
} from 'react-hook-form';

import { components } from '@/api';
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
  Alert,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { CreateCounterpartModal } from './CreateCounterpartModal';

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
  counterpartMatchingToOCRFound?: components['schemas']['CounterpartResponse'];
  counterpartRawName?: string;
  setShowEditCounterpartDialog?: (value: SetStateAction<boolean>) => void;
  showEditCounterpartButton?: boolean;
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
  counterpartMatchingToOCRFound,
  counterpartRawName,
  setShowEditCounterpartDialog,
  showEditCounterpartButton = false,
}: CounterpartAutocompleteProps<TFieldValues>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { componentSettings } = useMoniteContext();
  const { setValue, getValues } = useFormContext<TFieldValues>();
  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [newCounterpartId, setNewCounterpartId] = useState<string | null>(null);

  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList({
      query: { is_vendor: true },
    });

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
          newCounterpartId as PathValue<TFieldValues, FieldPath<TFieldValues>>,
          { shouldValidate: true }
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

  const currentValue = getValues(name);
  const selectedCounterpartOption = useMemo(() => {
    if (multiple) {
      return Array.isArray(currentValue) ? currentValue : [];
    }
    return (
      counterpartsAutocompleteData.find(
        (option) => option.id === currentValue
      ) || null
    );
  }, [currentValue, counterpartsAutocompleteData, multiple]);

  if (isCounterpartsLoading) {
    return (
      <TextField
        label={label}
        disabled
        InputProps={{
          endAdornment: <CircularProgress size={20} />,
        }}
      />
    );
  }

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
          return (
            <>
              <Autocomplete
                {...field}
                value={selectedCounterpartOption}
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
                        ?.id as PathValue<
                        TFieldValues,
                        FieldPath<TFieldValues>
                      >,
                      { shouldValidate: true }
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
                            {showEditCounterpartButton &&
                              setShowEditCounterpartDialog &&
                              !multiple &&
                              selectedCounterpartOption &&
                              currentValue && (
                                <Button
                                  size="small"
                                  sx={{ minWidth: 0, px: 1, mr: 1 }}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    setShowEditCounterpartDialog(true);
                                  }}
                                >
                                  {t(i18n)`Edit`}
                                </Button>
                              )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                    {!counterpartMatchingToOCRFound &&
                      counterpartRawName &&
                      !currentValue &&
                      !multiple && (
                        <FormHelperText>
                          {t(
                            i18n
                          )`The specified counterpart has not been saved yet.`}
                          <br />
                          {t(i18n)`Create new counterpart:`}
                          <StyledButtonLink
                            as="button"
                            sx={{ marginLeft: 0.5 }}
                            onClick={(event) => {
                              event.preventDefault();
                              setIsCreateCounterpartOpened(true);
                            }}
                          >
                            {counterpartRawName}
                          </StyledButtonLink>
                        </FormHelperText>
                      )}
                    {counterpartMatchingToOCRFound &&
                      currentValue == counterpartMatchingToOCRFound.id &&
                      !multiple &&
                      setShowEditCounterpartDialog && (
                        <Alert
                          severity="warning"
                          icon={false}
                          sx={{ marginTop: 1 }}
                        >
                          {t(
                            i18n
                          )`The counterpart details in the bill don’t fully match the saved counterpart. Consider editing the saved counterpart or creating a new one.`}
                          <br />
                          <StyledButtonLink
                            as="button"
                            sx={{ marginRight: 1 }}
                            inheritColor
                            onClick={(event) => {
                              event.preventDefault();
                              setShowEditCounterpartDialog(true);
                            }}
                          >{t(i18n)`Edit ${getCounterpartName(
                            counterpartMatchingToOCRFound
                          )}`}</StyledButtonLink>
                          {t(i18n)` or `}
                          <StyledButtonLink
                            as="button"
                            sx={{ marginLeft: 1 }}
                            inheritColor
                            onClick={(event) => {
                              event.preventDefault();
                              setIsCreateCounterpartOpened(true);
                            }}
                          >{t(i18n)`Create new counterpart`}</StyledButtonLink>
                        </Alert>
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

const StyledButtonLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'inheritColor',
})<{ inheritColor?: boolean }>(({ theme, inheritColor }) => ({
  all: 'unset',
  cursor: 'pointer',
  color: inheritColor ? 'inherit' : theme.palette.primary.main,
  textDecoration: 'underline',
  fontWeight: 500,
}));
