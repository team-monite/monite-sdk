import { useState, useRef } from 'react';

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

const getSteps = (selectedBank?: PaymentsPaymentsBank) => [
  BankPaymentSteps.BANK_LIST,
  ...(selectedBank?.payer_required ? [BankPaymentSteps.PAYER_FORM] : []),
  BankPaymentSteps.CONFIRM,
];

export function useBankPayment({
  paymentData,
}: UseBankPaymentProps): UseBankPaymentReturnType {
  const [currentStep, setCurrentStep] = useState(BankPaymentSteps.BANK_LIST);
  const selectedBankRef = useRef<PaymentsPaymentsBank>();
  const [selectedCountry, setSelectedCountry] = useState(
    PaymentsYapilyCountriesCoverageCodes.DE
  );

  const handleNextStep = () => {
    const steps = getSteps(selectedBankRef.current);
    const nextStepIndex = steps.findIndex((step) => step === currentStep) + 1;
    setCurrentStep(steps[nextStepIndex]);
  };

  const handlePrevStep = () => {
    const steps = getSteps(selectedBankRef.current);

    const prevStepIndex = steps.findIndex((step) => step === currentStep) - 1;
    setCurrentStep(steps[prevStepIndex]);
  };

  const [payerName, setPayerName] = useState(
    paymentData.payer?.bank_account?.name || ''
  );

  const [payerIban, setPayerIban] = useState(
    paymentData.payer?.bank_account?.iban || ''
  );

  const setSelectedBank = (bank: PaymentsPaymentsBank) => {
    selectedBankRef.current = bank;
  };

  return {
    currentStep,
    selectedBank: selectedBankRef.current,
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
