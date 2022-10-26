import { useState } from 'react';

import {
  PaymentsPaymentLinkResponse,
  PaymentsPaymentsBank,
  PaymentsYapilyCountriesCoverageCodes,
} from '@team-monite/sdk-api';

type UseBankPaymentProps = {
  paymentData: PaymentsPaymentLinkResponse;
};

type UseBankPaymentReturnType = {
  currentStep: BankPaymentSteps;
  selectedBank?: PaymentsPaymentsBank;
  setSelectedBank: (bank: PaymentsPaymentsBank) => void;
  selectedCountry: PaymentsYapilyCountriesCoverageCodes;
  setSelectedCountry: (country: PaymentsYapilyCountriesCoverageCodes) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  payerName: string;
  setPayerName: (name: string) => void;
  payerIban: string;
  setPayerIban: (iban: string) => void;
};

export enum BankPaymentSteps {
  BANK_LIST = 'bank_list',
  PAYER_FORM = 'payer_form',
  CONFIRM = 'confirm',
}

export function useBankPayment({
  paymentData,
}: UseBankPaymentProps): UseBankPaymentReturnType {
  const [currentStep, setCurrentStep] = useState(BankPaymentSteps.BANK_LIST);
  const [selectedBank, setSelectedBank] = useState<PaymentsPaymentsBank>();
  const [selectedCountry, setSelectedCountry] = useState(
    PaymentsYapilyCountriesCoverageCodes.DE
  );

  const steps = [
    BankPaymentSteps.BANK_LIST,
    ...(selectedBank?.payer_required ? [BankPaymentSteps.PAYER_FORM] : []),
    BankPaymentSteps.CONFIRM,
  ];

  const handleNextStep = () => {
    const nextStepIndex = steps.findIndex((step) => step === currentStep) + 1;
    setCurrentStep(steps[nextStepIndex]);
  };

  const handlePrevStep = () => {
    const prevStepIndex = steps.findIndex((step) => step === currentStep) - 1;
    setCurrentStep(steps[prevStepIndex]);
  };

  const [payerName, setPayerName] = useState(
    paymentData.payer?.bank_account?.name || ''
  );

  const [payerIban, setPayerIban] = useState(
    paymentData.payer?.bank_account?.iban || ''
  );

  return {
    currentStep,
    selectedBank,
    setSelectedBank,
    selectedCountry,
    setSelectedCountry,
    handleNextStep,
    handlePrevStep,
    payerName,
    setPayerName,
    payerIban,
    setPayerIban,
  };
}
