import React, { ReactNode } from 'react';
import {
  StyledInfoLabel,
  StyledInfoRow,
  StyledInfoValue,
} from '../../../payables/PayableDetails/PayableDetailsStyle';

type PaymentDetailsRowProps = {
  label: ReactNode;
  value: ReactNode;
};

const PaymentDetailsRow = ({ label, value }: PaymentDetailsRowProps) => {
  return (
    <StyledInfoRow>
      <StyledInfoLabel textSize={'small'} $color={'grey'}>
        {label}
      </StyledInfoLabel>
      <StyledInfoValue textAlign={'right'} textSize={'smallBold'}>
        {value}
      </StyledInfoValue>
    </StyledInfoRow>
  );
};

export default PaymentDetailsRow;
