'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
  DefaultValues,
} from 'react-hook-form';
import { useEffectOnce } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  ErrorSchema,
  HTTPValidationError,
  ValidationError,
} from '@monite/sdk-api';

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
  R extends FieldValues | undefined
> = {
  defaultValues: DefaultValues<V> | undefined;
  methods: UseFormReturn<V>;
  checkValue: (key: keyof DefaultValues<V>) => boolean;
  handleSubmit: HandleSubmitType<V, R>;
};

type ApiErrorType = ErrorSchema | HTTPValidationError | null;

type ErrorType = {
  body: ApiErrorType;
};

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
  R extends FieldValues | undefined
>(
  nextFields: OnboardingOutputFieldsType | undefined,
  type: ValidationSchemasType
): OnboardingFormType<V, R> {
  const [prevFields, setFields] = useState<
    OnboardingOutputFieldsType | undefined
  >(nextFields);

  const fieldsErrors = useMemo(
    () => generateErrorsByFields(prevFields),
    [prevFields]
  );

  const getDefaultValues = useCallback(() => {
    if (!prevFields) return undefined;
    return generateValuesByFields<DefaultValues<V>>(prevFields);
  }, [prevFields]);

  const validationSchema = useOnboardingValidationSchema({
    fields: prevFields,
    type,
  });

  const methods = useForm<V>({
    resolver: validationSchema && yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: useMemo(getDefaultValues, [getDefaultValues]),
  });

  const {
    setError,
    getValues,
    reset,
    formState: { errors, defaultValues: prevValues },
    handleSubmit: handleFormSubmit,
  } = methods;

  const nextValues = getValues() as DefaultValues<V>;

  const scrollToError = useScrollToError(errors);

  const setErrors = useCallback(
    (errors: OnboardingErrorField[]) => {
      errors.forEach(({ code, message }) => {
        setError(code as Path<V>, { type: 'custom', message });
      });
    },
    [setError]
  );

  useEffectOnce(() => {
    setErrors(fieldsErrors);
  });

  useEffect(() => {
    if (!prevFields) return;
    if (!nextFields) return;
    if (!nextValues) return;

    const restoredFields = restoreFields(
      prevFields,
      enrichFieldsByValues(nextFields, nextValues)
    );

    if (deepEqual(restoredFields, prevFields)) return;

    setFields(restoredFields);
  }, [prevFields, nextFields, nextValues]);

  useEffect(() => {
    const values = getDefaultValues();

    if (deepEqual(values, prevValues)) return;

    reset(values, {
      keepErrors: true,
      keepIsValid: true,
    });
    setErrors(fieldsErrors);
  }, [getDefaultValues, prevValues, reset, setErrors, fieldsErrors]);

  const checkValue = (key: keyof DefaultValues<V>) =>
    !!nextValues && key in nextValues && nextValues[key] !== undefined;

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
            return await apiContract(prepareValuesToSubmit(values));
          } catch (e) {
            const error = e as ErrorType;
            const errorBody = error.body;

            if (
              isHTTPValidationErrorBody(errorBody) &&
              errorBody.detail?.length
            ) {
              setErrors(getErrorsFieldsByValidationErrors(errorBody.detail));
              scrollToError();
            }
          }
        })(e);
      },
    [handleFormSubmit, scrollToError, setErrors]
  );

  return { methods, checkValue, defaultValues: nextValues, handleSubmit };
}
