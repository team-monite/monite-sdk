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

import InvoiceDetailes from './InvoiceDetailes';
import BanksListForm from './BanksListForm';
import NavHeader from '../NavHeader';

type YapilyFormProps = {
  receivableData?: ReceivableResponse;
};

const YapilyWidget = ({ receivableData }: YapilyFormProps) => {
  const { monite } = useComponentsContext();

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
          path={'/:code'}
          element={
            <InvoiceDetailes banks={banks} receivableData={receivableData} />
          }
        />
      </Routes>
    </>
  );
};

export default YapilyWidget;
