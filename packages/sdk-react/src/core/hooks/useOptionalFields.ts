type ShowFields<T> = {
  [K in keyof T as `show${Capitalize<string & K>}`]: boolean;
};

const isAnOptionalFieldsProperty = (key: string, obj: object): boolean => {
  return Object.keys(obj).includes(key);
};

export const useOptionalFields = <T extends object>(
  optionalFields: T | boolean | undefined,
  defaultOptionalFields: ShowFields<T>
): ShowFields<T> => {
  if (optionalFields === undefined || optionalFields === true) {
    return defaultOptionalFields;
  }

  if (optionalFields === false) {
    return Object.keys(defaultOptionalFields).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as ShowFields<T>
    );
  }

  if (
    typeof optionalFields === 'object' &&
    !Array.isArray(optionalFields) &&
    optionalFields !== null
  ) {
    return Object.keys(defaultOptionalFields).reduce((acc, key) => {
      const currentOptionalFieldKey =
        key.charAt(4).toLowerCase() + key.slice(5);
      const currentOptionalField =
        optionalFields[currentOptionalFieldKey as keyof T];

      if (
        isAnOptionalFieldsProperty(currentOptionalFieldKey, optionalFields) &&
        typeof currentOptionalField === 'boolean'
      ) {
        return {
          ...acc,
          [key]: currentOptionalField,
        };
      }

      return acc;
    }, {} as ShowFields<T>);
  }

  return defaultOptionalFields;
};
