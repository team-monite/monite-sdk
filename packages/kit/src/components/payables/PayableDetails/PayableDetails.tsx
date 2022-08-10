import React from 'react';
import styled from '@emotion/styled';

import { FormField } from '@monite/ui';
import PayableDetailsForm, {
  PayablesDetailsFormProps,
} from './PayableDetailsForm';

export interface PayablesDetailsProps extends PayablesDetailsFormProps {}

export const FormItem = styled(FormField)`
  margin-bottom: 24px;
`;

const PayableDetails = ({
  onSubmit,
  payable,
  tags,
  counterparts,
}: PayablesDetailsProps) => {
  return (
    <PayableDetailsForm
      tags={tags}
      counterparts={counterparts}
      onSubmit={onSubmit}
      payable={payable}
    />
  );
};

export default PayableDetails;
