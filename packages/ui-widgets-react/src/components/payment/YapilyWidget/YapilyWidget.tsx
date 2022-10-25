import React, { useState, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';

import {
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentMethodsEnum,
  PaymentsPaymentLinkResponse,
} from '@team-monite/sdk-api';

import { useInstitutionList, useCountryList } from 'core/queries/usePayment';

import InvoiceDetails from './InvoiceDetails';
import BanksListForm from './BanksListForm';
import PayerForm from './PayerForm';
import NavHeader from '../NavHeader';

type YapilyWidgetProps = {
  paymentData: PaymentsPaymentLinkResponse;
};
const YapilyWidget = ({ paymentData }: YapilyWidgetProps) => {
  const [selectedCountry, setSelectedCountry] = useState(
    PaymentsYapilyCountriesCoverageCodes.DE
  );

  const [payerName, setPayerName] = useState(
    paymentData.payer?.bank_account?.name || ''
  );
  const [payerIban, setPayerIban] = useState(
    paymentData.payer?.bank_account?.iban || ''
  );

  const { data: countries } = useCountryList(
    PaymentsPaymentMethodsEnum.SEPA_CREDIT
  );

  const { data: banks, refetch: refetchInstitutionList } = useInstitutionList(
    PaymentsPaymentMethodsEnum.SEPA_CREDIT,
    selectedCountry as PaymentsYapilyCountriesCoverageCodes
  );

  useEffect(() => {
    refetchInstitutionList();
  }, [selectedCountry]);

  //TODO move routing to payment app
  return (
    <>
      <NavHeader />
      <Routes>
        <Route
          path={'/'}
          element={
            <BanksListForm
              banks={banks?.data}
              countries={countries?.data}
              selectedCountry={selectedCountry}
              onChangeCountry={setSelectedCountry}
            />
          }
        />
        <Route
          path={'/:code/confirm'}
          element={
            <InvoiceDetails banks={banks?.data} paymentData={paymentData} />
          }
        />
        <Route
          path={'/:code/payer_form'}
          element={
            <PayerForm
              banks={banks?.data}
              paymentData={paymentData}
              name={payerName}
              iban={payerIban}
              onChangeName={setPayerName}
              onChangeIban={setPayerIban}
            />
          }
        />
      </Routes>
    </>
  );
};

export default YapilyWidget;
