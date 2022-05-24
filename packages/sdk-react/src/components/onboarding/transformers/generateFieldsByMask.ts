import { OnboardingMaskType, OnboardingOutputFieldsType } from '../types';

const isBooleanValue = (key: string) => {
  return (
    key === 'representative' ||
    key === 'owner' ||
    key === 'executive' ||
    key === 'director'
  );
};

export const generateFieldsByMask = <
  TOutput extends OnboardingOutputFieldsType
>(
  masks: OnboardingMaskType
): TOutput => {
  return Object.entries(masks).reduce((acc, [key, item]) => {
    const mask = item as OnboardingMaskType;

    if (isBooleanValue(key)) {
      return {
        ...acc,
        [key]: false,
      };
    }

    if (typeof mask !== 'object') {
      return {
        ...acc,
        [key]: {
          required: mask,
          error: null,
          value: null,
        },
      };
    }

    return {
      ...acc,
      [key]: generateFieldsByMask(mask),
    };
  }, {} as TOutput);
};
