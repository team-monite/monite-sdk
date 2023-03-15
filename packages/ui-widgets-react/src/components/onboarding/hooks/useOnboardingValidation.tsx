import { AnyObjectSchema, object, string, StringSchema } from 'yup';
import { isValidIBAN } from 'ibantools';

import {
  OnboardingAddress,
  OnboardingBankAccount,
  OnboardingBusinessProfile,
  OnboardingData,
  OnboardingIndividual,
  OnboardingRequirement,
} from '@team-monite/sdk-api';
import { differenceInYears, isMatch, parse } from 'date-fns';

const addressSchema: Record<
  keyof OnboardingAddress,
  StringSchema | AnyObjectSchema
> = {
  country: string().required(),
  line1: string().required(),
  line2: string().required(),
  city: string().required(),
  state: string().required(),
  postal_code: string().required(),
};

const individualSchema: Record<
  keyof OnboardingIndividual,
  StringSchema | AnyObjectSchema
> = {
  first_name: string().required(),
  last_name: string().required(),
  email: string().email().required(),
  phone: string().required(),
  date_of_birth: string()
    .required()
    .test('dob', '', (value, ctx) => {
      if (!value) return true;

      const format = 'MM / dd / yyyy';

      if (!isMatch(value, format)) {
        return ctx.createError({
          message: `Please provide a valid date.`,
        });
      }

      const currentDate = new Date();
      const date = parse(value, format, currentDate);
      const difference = differenceInYears(currentDate, date);

      if (difference < 18) {
        return ctx.createError({
          message: `Managers and owners must be at least 18 years old to use this service.`,
        });
      }

      if (difference > 120) {
        return ctx.createError({
          message: `Managers and owners must be under 120 years old.`,
        });
      }

      return true;
    }),
  id_number: string().required(),
  ssn_last_4: string().required().trim().min(4),
  address: object(addressSchema),
};

const bankAccountSchema: Record<
  keyof OnboardingBankAccount,
  StringSchema | AnyObjectSchema
> = {
  country: string().required(),
  currency: string().required(),
  iban: string().test('iban', '', (value, ctx) => {
    if (!value)
      return ctx.createError({
        message: 'Please enter your account number.',
      });

    if (!isValidIBAN(value))
      return ctx.createError({ message: 'Invalid IBAN' });

    return true;
  }),
};

const businessProfileSchema: Record<
  keyof OnboardingBusinessProfile,
  StringSchema | AnyObjectSchema
> = {
  mcc: string().required(),
  url: string().required(),
};

const schemas: Partial<
  Record<
    OnboardingRequirement,
    | typeof individualSchema
    | typeof bankAccountSchema
    | typeof businessProfileSchema
  >
> = {
  [OnboardingRequirement.INDIVIDUAL]: individualSchema,
  [OnboardingRequirement.BANK_ACCOUNT]: bankAccountSchema,
  [OnboardingRequirement.BUSINESS_PROFILE]: businessProfileSchema,
};

export default function useOnboardingValidation(
  data?: OnboardingData,
  requirements?: OnboardingRequirement[]
): AnyObjectSchema {
  const generateValidationSchema = <V, F>(
    validator: V,
    fields: F
  ): AnyObjectSchema =>
    object({
      ...(Object.keys(fields) as Array<keyof V & keyof F>).reduce(
        (acc, key) => ({
          ...acc,
          [key]:
            typeof fields[key] === 'object' && key === 'address'
              ? generateValidationSchema(addressSchema, fields[key])
              : validator[key]
              ? validator[key]
              : string().required(),
        }),
        {}
      ),
    });

  if (!data || !requirements) return object({});

  return object(
    requirements.reduce<{ [key in string]: AnyObjectSchema }>(
      (acc, requirement) => ({
        ...acc,
        [requirement]: generateValidationSchema(
          schemas[requirement],
          data[requirement]
        ),
      }),
      {}
    )
  );
}
