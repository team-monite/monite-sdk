import React, { useState, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';

import {
  PaymentsYapilyCountriesCoverageCodes,
  PaymentsPaymentMethodsEnum,
} from '@team-monite/sdk-api';

import { useInstitutionList, useCountriesList } from 'core/queries/usePayment';

import InvoiceDetails from './InvoiceDetails';
import BanksListForm from './BanksListForm';
import PayerForm from './PayerForm';
import NavHeader from '../NavHeader';

const YapilyWidget = () => {
  const [selectedCountry, setSelectedCountry] = useState(
    PaymentsYapilyCountriesCoverageCodes.DE
  );

  const { data: countries } = useCountriesList(
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
          element={<InvoiceDetails banks={banks?.data} />}
        />
        <Route
          path={'/:code/payer_form'}
          element={<PayerForm banks={banks?.data} />}
        />
      </Routes>
    </>
  );
};

export default YapilyWidget;
