import React, { useState, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';

import {
  ReceivableResponse,
  PaymentsPaymentsCountry,
  PaymentsPaymentsBank,
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentMethodsCountriesResponse,
  PaymentsPaymentsPaymentsPaymentsBanksResponse,
  PaymentsPaymentMethodsEnum,
} from '@team-monite/sdk-api';

import { useComponentsContext } from '@team-monite/ui-widgets-react';

import InvoiceDetails from './InvoiceDetails';
import BanksListForm from './BanksListForm';
import PayerForm from './PayerForm';
import NavHeader from '../NavHeader';

type YapilyFormProps = {
  receivableData?: ReceivableResponse;
};

const YapilyWidget = ({ receivableData }: YapilyFormProps) => {
  const { monite } = useComponentsContext();

  // TODO use react-query

  const [selectedCountry, setSelectedCountry] = useState(
    PaymentsYapilyCountriesCoverageCodes.DE
  );

  const [banks, setBanks] = useState<Array<PaymentsPaymentsBank>>([]);

  const [countries, setCountries] = useState<Array<PaymentsPaymentsCountry>>();

  useEffect(() => {
    monite.api.payment
      .getPaymentMethodCountries(PaymentsPaymentMethodsEnum.SEPA_CREDIT)
      .then((response: PaymentsPaymentMethodsCountriesResponse) => {
        setCountries(response.data);
      });
  }, [monite.api.payment]);

  useEffect(() => {
    monite.api.payment
      .getInstitutions(
        PaymentsPaymentMethodsEnum.SEPA_CREDIT,
        selectedCountry as PaymentsYapilyCountriesCoverageCodes
      )
      .then((response: PaymentsPaymentsPaymentsPaymentsBanksResponse) => {
        setBanks(response.data);
      });
  }, [selectedCountry, monite.api.payment]);

  return (
    <>
      <NavHeader />
      <Routes>
        <Route
          path={'/'}
          element={
            <BanksListForm
              banks={banks}
              countries={countries}
              selectedCountry={selectedCountry}
              onChangeCountry={setSelectedCountry}
              receivableData={receivableData}
            />
          }
        />
        <Route
          path={'/:code/confirm'}
          element={
            <InvoiceDetails banks={banks} receivableData={receivableData} />
          }
        />
        <Route
          path={'/:code/payer_form'}
          element={<PayerForm banks={banks} />}
        />
      </Routes>
    </>
  );
};

export default YapilyWidget;
