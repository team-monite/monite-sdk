import { format as formatDate, isValid } from 'date-fns';

import {
  OnboardingErrorField,
  OnboardingField,
  OnboardingFieldsType,
  OnboardingOutputFieldsType,
  OnboardingOutputValuesType,
  OnboardingValuesType,
  OnboardingValueType,
  OnboardingOptionalParams,
} from '../types';

export function isOnboardingField(
  field: OnboardingFieldsType
): field is OnboardingField {
  return !!field && typeof field === 'object' && 'required' in field;
}

export const mapValueToForm = (
  key: string,
  value: OnboardingValueType | undefined
): OnboardingValueType => {
  if (value === undefined) return null;

  return value;
};

export const mapValueToField = (
  key: string,
  value: OnboardingValueType | undefined
): OnboardingValueType => {
  if (value === undefined) return null;

  if (
    (typeof value === 'string' || value instanceof Date) &&
    key === 'date_of_birth' &&
    isValid(new Date(value))
  ) {
    return formatDate(new Date(value), 'yyyy-MM-dd');
  }

  return value;
};

export const generateValuesByFields = <
  TOutput extends OnboardingOutputValuesType
>(
  fields: OnboardingFieldsType
): TOutput => {
  return Object.entries(fields).reduce((acc, [key, item]) => {
    const field: OnboardingFieldsType = item;

    if (typeof field === 'string' || typeof field === 'boolean') {
      return {
        ...acc,
        [key]: field,
      };
    }

    if (isOnboardingField(field)) {
      return {
        ...acc,
        [key]: mapValueToForm(key, field.value),
      };
    }

    return {
      ...acc,
      [key]: generateValuesByFields(field),
    };
  }, {} as TOutput);
};

export const generateErrorsByFields = (
  fields?: OnboardingFieldsType,
  parentKey: string = ''
): OnboardingErrorField[] => {
  if (!fields) return [];

  return Object.entries(fields).reduce<OnboardingErrorField[]>(
    (acc, [key, item]) => {
      const field = item as OnboardingFieldsType;
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof field === 'boolean' || typeof field === 'string') return acc;

      if (isOnboardingField(field)) {
        if (!field.error) return acc;

        return [
          ...acc,
          {
            code: fullKey,
            message: field.error.message,
          },
        ];
      }

      return [...acc, ...generateErrorsByFields(field, fullKey)];
    },
    []
  );
};

export const findEmptyRequiredFields = (
  fields?: OnboardingFieldsType,
  parentKey: string = ''
): string[] => {
  if (!fields) return [];

  return Object.entries(fields).reduce<string[]>((acc, [key, item]) => {
    const field = item as OnboardingFieldsType;
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof field === 'boolean' || typeof field === 'string') return acc;

    if (isOnboardingField(field)) {
      if (field.required && !field.value && !field.error)
        return [...acc, fullKey];

      return acc;
    }

    return [...acc, ...findEmptyRequiredFields(field, fullKey)];
  }, []);
};

export const enrichFieldsByValues = <
  TOutput extends OnboardingOutputFieldsType
>(
  fields: OnboardingFieldsType,
  values: OnboardingOutputValuesType
): TOutput => {
  return Object.entries(fields).reduce((acc, [key, item]) => {
    const field = item as OnboardingFieldsType;
    const value = values[key];

    if (value === undefined) {
      return {
        ...acc,
        [key]: field,
      };
    }

    if (typeof field === 'boolean' || typeof field === 'string') {
      return {
        ...acc,
        [key]: value,
      };
    }

    if (isOnboardingField(field)) {
      return {
        ...acc,
        [key]: {
          ...field,
          error: null,
          value: mapValueToField(key, value as OnboardingValueType),
        },
      };
    }

    if (!value) return acc;

    return {
      ...acc,
      [key]: enrichFieldsByValues(field, value as OnboardingOutputValuesType),
    };
  }, {} as TOutput);
};

export const prepareValuesToSubmit = <
  TOutput extends OnboardingOutputValuesType
>(
  values: OnboardingOutputValuesType
): TOutput => {
  return Object.entries(values).reduce((acc, [key, item]) => {
    const value = item;

    if (typeof value !== 'object' || value === null) {
      return {
        ...acc,
        [key]: mapValueToField(key, value),
      };
    }

    return {
      ...acc,
      [key]: prepareValuesToSubmit(value as OnboardingOutputValuesType),
    };
  }, {} as TOutput);
};

type GenerateFieldsByValuesParams = OnboardingOptionalParams & {
  values: OnboardingOutputValuesType;
};

export const generateFieldsByValues = <
  TOutput extends OnboardingOutputFieldsType
>({
  values,
  parentKey = '',
  exclude = [],
  optional = [],
  errors = [],
}: GenerateFieldsByValuesParams): TOutput => {
  return Object.entries(values).reduce((acc, [key, item]) => {
    const value = item as OnboardingValuesType;
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (exclude.includes(fullKey)) return acc;

    if (typeof value === 'boolean') {
      return {
        ...acc,
        [key]: mapValueToForm(key, value),
      };
    }

    if (value instanceof Blob) {
      return {
        ...acc,
        [key]: value,
      };
    }

    if (key === 'id') {
      return {
        ...acc,
        [key]: value,
      };
    }

    if (typeof value !== 'object' || value === null) {
      const error = errors.find((error) => error.code === fullKey)?.message;

      return {
        ...acc,
        [key]: {
          required: !optional.includes(fullKey),
          error: error ? { message: error } : null,
          value: mapValueToField(key, value),
        },
      };
    }

    return {
      ...acc,
      [key]: generateFieldsByValues({
        values: value,
        parentKey: fullKey,
        exclude,
        optional,
        errors,
      }),
    };
  }, {} as TOutput);
};

type GenerateOptionalFields = OnboardingOptionalParams & {
  fields: OnboardingFieldsType;
};

export const generateOptionalFields = <
  TOutput extends OnboardingOutputFieldsType
>({
  fields,
  parentKey = '',
  exclude = [],
  optional = [],
  errors = [],
}: GenerateOptionalFields): TOutput => {
  return Object.entries(fields).reduce((acc, [key, item]) => {
    const field = item as OnboardingFieldsType;
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (exclude.includes(fullKey)) return acc;

    if (typeof field === 'boolean' || key === 'id') {
      return {
        ...acc,
        [key]: field,
      };
    }

    if (isOnboardingField(field)) {
      const error = errors.find((error) => error.code === fullKey)?.message;

      return {
        ...acc,
        [key]: {
          ...field,
          required: !optional.includes(fullKey),
          error: error ? { message: error } : null,
        },
      };
    }

    return {
      ...acc,
      [key]: generateOptionalFields({
        fields: field,
        parentKey: fullKey,
        exclude,
        optional,
        errors,
      }),
    };
  }, {} as TOutput);
};

const isAcceptableValue = (
  value: OnboardingFieldsType
): value is string | number | boolean | Blob => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof Blob
  );
};

/**
 * This function is used to restore the previous values of an object.
 * If the value is an object, the function is called recursively on it.
 *
 * @template T - The type of the object.
 *
 * @param prevValues - The object that contains previous values.
 * @param nextValues - The object that contains next values.
 *
 * @returns - Returns the object with its values restored based on the
 * previous values.
 *
 * @example
 * restoreValues({a: 1, b: {c: 2, d: null}}, {a: null, b: {c: null, d: 3}});
 * returns {a: 1, b: {c: 2, d: 3}}
 */
export const restoreFields = <T extends OnboardingOutputFieldsType>(
  prevValues: T,
  nextValues: T
): T => {
  return Object.entries(nextValues).reduce((acc, [code, nextField]) => {
    const key = code as keyof T;
    const prevField = prevValues[key];

    if (prevField === undefined && nextField !== undefined) {
      return {
        ...acc,
        [key]: nextField,
      };
    }

    if (nextField === undefined || nextField === null) {
      return {
        ...acc,
        [key]: prevField,
      };
    }

    if (prevField === undefined || prevField === null) {
      return {
        ...acc,
        [key]: nextField,
      };
    }

    if (isAcceptableValue(nextField)) {
      return {
        ...acc,
        [key]: nextField,
      };
    }

    if (isAcceptableValue(prevField)) {
      return {
        ...acc,
        [key]: prevField,
      };
    }

    if (isOnboardingField(prevField) && isOnboardingField(nextField)) {
      return {
        ...acc,
        [key]: {
          required: nextField.required,
          value:
            nextField.value !== prevField.value
              ? nextField.value
              : prevField.value,
          error:
            nextField.value !== prevField.value
              ? nextField.error
              : prevField.error,
        },
      };
    }

    return {
      ...acc,
      [key]: restoreFields(prevField, nextField),
    };
  }, nextValues);
};
