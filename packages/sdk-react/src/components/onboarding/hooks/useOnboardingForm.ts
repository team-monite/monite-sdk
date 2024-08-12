import { FormEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
  DefaultValues,
} from 'react-hook-form';

import { components } from '@/api';
import { yupResolver } from '@hookform/resolvers/yup';

import deepEqual from 'deep-eql';

import {
  enrichFieldsByValues,
  generateErrorsByFields,
  generateValuesByFields,
  prepareValuesToSubmit,
  restoreFields,
  ValidationSchemasType,
} from '../transformers';
import { OnboardingErrorField, OnboardingOutputFieldsType } from '../types';
import { useOnboardingValidationSchema } from './useOnboardingValidationSchema';
import { useScrollToError } from './useScrollToError';

type FormType = (e: FormEvent<HTMLFormElement>) => void;
type ApiContractType<V, R> = (values: V) => Promise<R> | R;
type HandleSubmitType<V, R> = (apiContract: ApiContractType<V, R>) => FormType;

export type OnboardingFormType<
  V extends FieldValues,
  R extends FieldValues | undefined | void
> = {
  defaultValues: DefaultValues<V> | undefined;
  methods: UseFormReturn<V>;
  checkValue: (key: keyof DefaultValues<V>) => boolean;
  handleSubmit: HandleSubmitType<V, R>;
};

type ApiErrorType = ErrorSchema | HTTPValidationError | null;

function isHTTPValidationErrorBody(
  body: ApiErrorType
): body is HTTPValidationError {
  return !!(body && 'detail' in body);
}

const getErrorsFieldsByValidationErrors = (
  errors: Array<ValidationError>
): OnboardingErrorField[] =>
  errors.map(({ loc, msg }) => ({
    code: loc.filter((loc) => loc !== 'body').join('.'),
    message: msg,
  }));

export function useOnboardingForm<
  V extends FieldValues,
  R extends FieldValues | undefined | void
>(
  _incomingFields: OnboardingOutputFieldsType | undefined,
  type: ValidationSchemasType
): OnboardingFormType<V, R> {
  const _incomingFieldsRef = useRef(_incomingFields);
  const incomingFields = useMemo(() => {
    if (deepEqual(_incomingFieldsRef.current, _incomingFields))
      return _incomingFieldsRef.current;
    return (_incomingFieldsRef.current = _incomingFields);
  }, [_incomingFields]);

  const validationSchema = useOnboardingValidationSchema({
    fields: incomingFields,
    type,
  });

  const methods = useForm<V>({
    resolver: validationSchema && yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: incomingFields
      ? generateValuesByFields<DefaultValues<V>>(incomingFields)
      : undefined,
  });

  const {
    setError,
    getValues,
    reset,
    watch,
    formState: { errors },
    handleSubmit: handleFormSubmit,
  } = methods;

  const scrollToError = useScrollToError(errors);

  const setErrors = useCallback(
    (errors: OnboardingErrorField[]) => {
      errors.forEach(({ code, message }) => {
        setError(code as Path<V>, { type: 'custom', message });
      });
    },
    [setError]
  );

  const storedFieldsRef = useRef(incomingFields);

  const formValues = watch();

  useEffect(() => {
    if (!incomingFields) return;
    storedFieldsRef.current = restoreFields(
      storedFieldsRef.current ?? incomingFields,
      enrichFieldsByValues(incomingFields, formValues)
    );
  }, [formValues, incomingFields]);

  useEffect(() => {
    if (!incomingFields) return;

    reset(
      generateValuesByFields<DefaultValues<V>>(
        storedFieldsRef.current ?? incomingFields
      ),
      {
        keepErrors: true,
        keepIsValid: true,
      }
    );

    setErrors(generateErrorsByFields(incomingFields));
  }, [incomingFields, reset, setErrors]);

  const checkValue = (key: keyof DefaultValues<V>) => {
    const currentFormValues = getValues() as DefaultValues<V>;
    return (
      !!currentFormValues &&
      key in currentFormValues &&
      currentFormValues[key] !== undefined
    );
  };

  const handleSubmit = useCallback(
    (apiContract: ApiContractType<V, R>): FormType =>
      (e) => {
        const isValid = scrollToError();

        if (!isValid) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        return handleFormSubmit(async (values) => {
          try {
            return void (await apiContract(prepareValuesToSubmit(values)));
          } catch (e) {
            const error = e as ApiErrorType;

            if (isHTTPValidationErrorBody(error) && error.detail?.length) {
              setErrors(getErrorsFieldsByValidationErrors(error.detail));
              scrollToError();
            }
          }
        })(e);
      },
    [handleFormSubmit, scrollToError, setErrors]
  );

  return {
    methods,
    checkValue,
    defaultValues: getValues() as DefaultValues<V>,
    handleSubmit,
  };
}

type ErrorSchema = components['schemas']['ErrorSchemaResponse'];
type HTTPValidationError = components['schemas']['HTTPValidationError'];
type ValidationError = components['schemas']['ValidationError'];
