import { components } from '@/api';
import { CreateCounterpartModal } from '@/components/counterparts/components/CreateCounterpartModal';
import { getCounterpartName } from '@/components/counterparts/helpers';
import type {
  CustomerTypes,
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useDebounce, useIsMounted } from '@/core/hooks';
import { useCounterpartList, useCounterpartById } from '@/core/queries';
import { Alert, AlertDescription, AlertTitle } from '@/ui/components/alert';
import { Button } from '@/ui/components/button';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  CircularProgress,
  TextField,
  FormHelperText,
  createFilterOptions,
} from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useState, useMemo, useEffect, SetStateAction } from 'react';
import {
  Controller,
  Control,
  useFormContext,
  FieldValues,
  FieldPath,
  PathValue,
} from 'react-hook-form';

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
  AICounterpartSuggestions?: components['schemas']['SuggestedCounterpartPayload'];
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
  AICounterpartSuggestions,
}: CounterpartAutocompleteProps<TFieldValues>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { componentSettings } = useMoniteContext();
  const { setValue, getValues } = useFormContext<TFieldValues>();
  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [newCounterpartId, setNewCounterpartId] = useState<string | null>(null);
  const [hasUserChangedValue, setHasUserChangedValue] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const isMountedRef = useIsMounted();

  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList({
      query: { is_vendor: true },
    });

  const { data: aiSuggestedCounterpartData } = useCounterpartById(
    !multiple && AICounterpartSuggestions?.id
      ? AICounterpartSuggestions.id
      : undefined
  );
  const debouncedAISuggestedData = useDebounce(aiSuggestedCounterpartData, 300);

  const currentValue = getValues(name);

  const hasFieldValue = useMemo(() => {
    if (multiple) {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    return (
      currentValue !== undefined && currentValue !== null && currentValue !== ''
    );
  }, [currentValue, multiple]);

  const autocompleteOptions = useMemo<
    Array<CounterpartsAutocompleteOptionProps>
  >(() => {
    const baseOptions =
      counterparts?.data.map((counterpart) => ({
        id: counterpart.id,
        label: getCounterpartName(counterpart),
      })) ?? [];

    // If the AI suggested counterpart is not in the list of counterparts, add it to the list
    if (
      !multiple &&
      aiSuggestedCounterpartData &&
      !baseOptions.some((c) => c.id === aiSuggestedCounterpartData.id)
    ) {
      return [
        {
          id: aiSuggestedCounterpartData.id,
          label: getCounterpartName(aiSuggestedCounterpartData),
        },
        ...baseOptions,
      ];
    }
    // Else, return the base options
    return baseOptions;
  }, [counterparts, multiple, aiSuggestedCounterpartData]);

  useEffect(() => {
    if (newCounterpartId) {
      const currentValues = getValues(name);
      if (multiple) {
        const values = currentValues ? currentValues : [];
        const isAlreadyAdded = (
          values as Array<CounterpartsAutocompleteOptionProps>
        )?.some((counterpart) => counterpart.id === newCounterpartId);

        if (!isAlreadyAdded) {
          const existingCounterpart = autocompleteOptions.find(
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
    autocompleteOptions,
    multiple,
    i18n,
  ]);

  // Track form initialization to prevent premature auto-selection
  useEffect(() => {
    if (hasFieldValue) {
      setIsFormInitialized(true);
    } else {
      // Set a timeout to mark as initialized even if no value is set
      // This prevents the form from never being initialized
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          setIsFormInitialized(true);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [hasFieldValue, isMountedRef]);

  // Auto-select AI suggested counterpart with proper timing and debouncing
  useEffect(() => {
    // Only proceed if form is initialized and we have all required data
    if (
      !multiple &&
      AICounterpartSuggestions?.id &&
      debouncedAISuggestedData &&
      isFormInitialized &&
      !hasUserChangedValue
    ) {
      // Only set if the field is actually empty (not just falsy)
      if (!hasFieldValue) {
        // Use setTimeout to ensure this runs after the current render cycle
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            setValue(
              name,
              AICounterpartSuggestions.id as PathValue<
                TFieldValues,
                FieldPath<TFieldValues>
              >,
              { shouldValidate: true }
            );
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    AICounterpartSuggestions,
    debouncedAISuggestedData,
    multiple,
    getValues,
    name,
    setValue,
    hasUserChangedValue,
    isFormInitialized,
    hasFieldValue,
    isMountedRef,
  ]);

  const selectedCounterpartOption = useMemo(() => {
    if (multiple) {
      return Array.isArray(currentValue) ? currentValue : [];
    }
    return (
      autocompleteOptions.find((option) => option.id === currentValue) || null
    );
  }, [currentValue, autocompleteOptions, multiple]);

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
                options={autocompleteOptions}
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
                  setHasUserChangedValue(true);

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
                                  size="sm"
                                  variant="ghost"
                                  className="mtw:min-w-0 mtw:px-1 mtw:mr-1"
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

                    {AICounterpartSuggestions &&
                      currentValue == AICounterpartSuggestions.id && (
                        <Alert
                          variant="info"
                          className="mtw:mt-2"
                          icon={<Sparkles />}
                        >
                          <AlertTitle>{t(
                            i18n
                          )`Vendor auto-matched by AI`}</AlertTitle>
                          <AlertDescription>{t(
                            i18n
                          )`The vendor name on the bill doesn’t exactly match the saved counterpart, so AI selected the closest option.`}</AlertDescription>
                        </Alert>
                      )}

                    {!AICounterpartSuggestions &&
                      !counterpartMatchingToOCRFound &&
                      counterpartRawName &&
                      !currentValue &&
                      !multiple && (
                        <FormHelperText>
                          {t(
                            i18n
                          )`The specified counterpart has not been saved yet.`}
                          <br />
                          {t(i18n)`Create new counterpart:`}
                          <Button
                            variant="link"
                            size="sm"
                            className="mtw:ml-0.5 mtw:p-0 mtw:h-auto mtw:font-medium"
                            onClick={(event) => {
                              event.preventDefault();
                              setIsCreateCounterpartOpened(true);
                            }}
                          >
                            {counterpartRawName}
                          </Button>
                        </FormHelperText>
                      )}

                    {!AICounterpartSuggestions &&
                      counterpartMatchingToOCRFound &&
                      currentValue == counterpartMatchingToOCRFound.id &&
                      !multiple &&
                      setShowEditCounterpartDialog && (
                        <Alert variant="warning" className="mtw:mt-2">
                          <AlertDescription>
                            {t(
                              i18n
                            )`The counterpart details in the bill don’t fully match the saved counterpart. Consider editing the saved counterpart or creating a new one.`}
                            <br />
                            <Button
                              variant="link"
                              size="sm"
                              className="mtw:mr-1 mtw:p-0 mtw:h-auto mtw:font-medium mtw:text-inherit mtw:underline"
                              onClick={(event) => {
                                event.preventDefault();
                                setShowEditCounterpartDialog(true);
                              }}
                            >{t(i18n)`Edit ${getCounterpartName(
                              counterpartMatchingToOCRFound
                            )}`}</Button>
                            {t(i18n)` or `}
                            <Button
                              variant="link"
                              size="sm"
                              className="mtw:ml-1 mtw:p-0 mtw:h-auto mtw:font-medium mtw:text-inherit mtw:underline"
                              onClick={(event) => {
                                event.preventDefault();
                                setIsCreateCounterpartOpened(true);
                              }}
                            >{t(i18n)`Create new counterpart`}</Button>
                          </AlertDescription>
                        </Alert>
                      )}
                  </>
                )}
                renderOption={(props, counterpartOption) => {
                  return isCreateNewCounterpartOption(counterpartOption) ? (
                    <Button
                      key={counterpartOption.id}
                      variant="ghost"
                      size="sm"
                      className="mtw:justify-start mtw:px-2 mtw:w-full"
                      onClick={() => setIsCreateCounterpartOpened(true)}
                    >
                      <AddIcon className="mtw:mr-2" />
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
