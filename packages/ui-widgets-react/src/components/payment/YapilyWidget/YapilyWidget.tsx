import { PaymentIntentWithSecrets } from '@team-monite/sdk-api';

import { useBankPayment, BankPaymentSteps } from './useBankPayment';

import InvoiceDetails from './InvoiceDetails';
import BanksListForm from './BanksListForm';
import PayerForm from './PayerForm';
import NavHeader from '../NavHeader';

type YapilyWidgetProps = {
  paymentIntent: PaymentIntentWithSecrets;
  onChangeMethod: () => void;
};
const YapilyWidget = ({ paymentIntent, onChangeMethod }: YapilyWidgetProps) => {
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
  } = useBankPayment({ paymentIntent });

  return (
    <>
      <NavHeader
        handleBack={
          currentStep === BankPaymentSteps.BANK_LIST
            ? onChangeMethod
            : handlePrevStep
        }
      />
      {currentStep === BankPaymentSteps.BANK_LIST && (
        <BanksListForm
          setSelectedBank={setSelectedBank}
          handleNextStep={handleNextStep}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          onChangeMethod={onChangeMethod}
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
        <InvoiceDetails bank={selectedBank} paymentIntent={paymentIntent} />
      )}
    </>
  );
};

export default YapilyWidget;
