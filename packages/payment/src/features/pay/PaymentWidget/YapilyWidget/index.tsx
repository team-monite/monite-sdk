import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import InvoiceDetailes from './InvoiceDetailes';
import BanksListForm from './BanksListForm';
import NavHeader from '../NavHeader';
import { ReceivableResponse } from '@monite/sdk-api';
import { demoBanks } from '../fixtures/banks';

type YapilyFormProps = {
  receivableData?: ReceivableResponse;
};

const YapilyWidget = ({ receivableData }: YapilyFormProps) => {
  // TODO: here we should fetch an actual list of banks from the API when it will be ready
  const [banks] = useState(demoBanks);
  return (
    <>
      <NavHeader />
      <Routes>
        <Route
          path={'/'}
          element={<BanksListForm receivableData={receivableData} />}
        />
        <Route
          path={'/:id'}
          element={
            <InvoiceDetailes banks={banks} receivableData={receivableData} />
          }
        />
      </Routes>
    </>
  );
};

export default YapilyWidget;
