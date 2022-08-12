import React, { useState } from 'react';

import PayableDetails from './PayableDetails';
import payables from '../fixtures/list';

export interface PayablesDetailsAPIProps {
  id: string;
  onClose: () => void;
}

const usePayableDetails = (id: string) => {
  const [isEdit] = useState<boolean>(true);
  const [isLoading] = useState<boolean>(true);

  console.log(id);

  return {
    isEdit,
    isLoading,
  };
};

const PayablesDetailsAPI = ({ id, onClose }: PayablesDetailsAPIProps) => {
  const { isLoading } = usePayableDetails(id);

  return (
    <PayableDetails
      isLoading={isLoading}
      tags={[]}
      counterparts={[]}
      payable={payables[0]}
      onClose={onClose}
      onSubmit={(values) => {
        console.log(values);
      }}
      onSave={(values) => {
        console.log(values);
      }}
      onPay={(values) => {
        console.log(values);
      }}
    />
  );
};

export default PayablesDetailsAPI;
