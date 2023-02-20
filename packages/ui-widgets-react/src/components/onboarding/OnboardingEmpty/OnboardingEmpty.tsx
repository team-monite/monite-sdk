import React from 'react';
import { OnboardingFormProps } from '../hooks/useOnboardingForm';

const OnboardingEmpty = ({ formKey }: OnboardingFormProps) => {
  return <>{formKey}</>;
};

export default OnboardingEmpty;
