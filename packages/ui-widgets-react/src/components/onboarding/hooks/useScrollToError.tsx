import { useEffect } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { OnboardingRequirement } from '@team-monite/sdk-api';

export default function useScrollToError<T>(
  errors: FieldErrors<T>,
  requirements: OnboardingRequirement[]
) {
  useEffect(() => {
    if (!errors) return;

    // const firstError = requirements
    //   .map(
    //     (requirement) =>
    //       Object.keys(errors[requirement]) as Array<keyof typeof errors>
    //   )
    //   .reduce<keyof typeof errors | null>((field, acc) => {
    //     const fieldKey = field as keyof typeof errors;
    //     return !!errors[fieldKey] ? fieldKey : acc;
    //   }, null) as string[];

    // const errorList: string[] = requirements.map((requirement) => {
    //   const group = errors[requirement as keyof typeof errors];
    //
    //   if (!group) return false;
    //
    //   const errors: string[] = Object.keys(group);
    //
    //   const error = errors.reduce<keyof typeof errors>(
    //     (field: keyof typeof errors, acc) => {
    //       const fieldKey = field as keyof typeof errors;
    //       return !!errors[fieldKey]
    //         ? `${requirement}.${fieldKey as string}`
    //         : acc;
    //     },
    //     null
    //   ) as string;
    //
    //   return !!error;
    // });

    // const errorList: string[] = [];

    // console.log(errors, errorList);

    // if (errorList.length > 0) {
    //   const element = document.getElementById(errorList[0]);
    //
    //   element?.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'center',
    //     inline: 'center',
    //   });
    // }
  }, [errors, requirements]);
}
