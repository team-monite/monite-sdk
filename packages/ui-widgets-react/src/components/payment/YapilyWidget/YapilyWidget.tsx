import {
  PaymentIntentWithSecrets,
  MoniteAllPaymentMethodsTypes,
} from '@team-monite/sdk-api';

import { useBankPayment, BankPaymentSteps } from './useBankPayment';

import InvoiceDetails from './InvoiceDetails';
import BanksListForm from './BanksListForm';
import PayerForm from './PayerForm';
import NavHeader from '../NavHeader';

type YapilyWidgetProps = {
  paymentIntent: PaymentIntentWithSecrets;
  onChangeMethod: () => void;
  onAuthorizePayment: (url: string) => void;
};
const YapilyWidget = ({
  paymentIntent,
  onChangeMethod,
  onAuthorizePayment,
}: YapilyWidgetProps) => {
  const {
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
    authorizePayment,
    isLoadingAuthorize,
  } = useBankPayment({ paymentIntent, onAuthorizePayment });

  const isOnlyYapilyAvailable =
    paymentIntent.payment_methods.length === 1 &&
    paymentIntent.payment_methods[0] ===
      MoniteAllPaymentMethodsTypes.SEPA_CREDIT;

  const isNavHeaderHidden =
    isOnlyYapilyAvailable && currentStep === BankPaymentSteps.BANK_LIST;

  return (
    <>
      {!isNavHeaderHidden && (
        <NavHeader
          handleBack={
            currentStep === BankPaymentSteps.BANK_LIST
              ? onChangeMethod
              : handlePrevStep
          }
        />
      )}
      {currentStep === BankPaymentSteps.BANK_LIST && (
        <BanksListForm
          setSelectedBank={setSelectedBank}
          handleNextStep={handleNextStep}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          onChangeMethod={onChangeMethod}
          isOnlyYapilyAvailable={isOnlyYapilyAvailable}
        />
      )}
      {currentStep === BankPaymentSteps.PAYER_FORM && (
        <PayerForm
          bank={selectedBank}
          handleNextStep={handleNextStep}
          name={payerName}
          iban={payerIban}
          onChangeName={setPayerName}
          onChangeIban={setPayerIban}
        />
      )}
      {currentStep === BankPaymentSteps.CONFIRM && (
        <InvoiceDetails
          bank={selectedBank}
          paymentIntent={paymentIntent}
          authorizePayment={authorizePayment}
          isLoading={isLoadingAuthorize}
        />
      )}
    </>
  );
};

export default YapilyWidget;
