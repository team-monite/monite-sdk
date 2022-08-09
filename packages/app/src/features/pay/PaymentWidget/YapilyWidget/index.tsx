import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, UArrowLeft } from '@monite/ui';
import { Routes, Route } from 'react-router-dom';

import InvoiceDetailes from './InvoiceDetailes';
import BanksListForm from './BanksListForm';

import { ReceivableResponse } from '@monite/js-sdk';
import { demoBanks } from '../fixtures/banks';

type YapilyFormProps = {
  receivableData?: ReceivableResponse;
};

const YapilyWidget = ({ receivableData }: YapilyFormProps) => {
  // TODO: here we should fetch an actual list of banks from the API when it will be ready
  const [banks] = useState(demoBanks);

  const navigate = useNavigate();

  return (
    <>
      <div>
        <Button
          color="grey"
          leftIcon={<UArrowLeft width={24} height={24} />}
          variant="text"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
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
