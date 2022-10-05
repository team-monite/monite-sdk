import React from 'react';
import { Box, FormField, Input } from '@team-monite/ui-kit-react';

const PayerInfoForm = () => {
  return (
    <>
      <Box mt="32px">
        <FormField id="name" label={"Account's holder name"}>
          <Input value="" required />
        </FormField>
      </Box>
      <Box mt="24px">
        <FormField id="iban" label={'IBAN'}>
          <Input value="" required />
        </FormField>
      </Box>
    </>
  );
};

export default PayerInfoForm;
