import { Button, EditIcon, LabelText, Card, Box } from '@monite/ui';
import React from 'react';

type CounterPartCompanyProps = {
  onEdit: () => void;
  companyName: string;
  type: string;
  address: string;
  phone?: string;
  email?: string;
  taxId?: string;
};

const CounterPartCompany = ({
  onEdit,
  companyName,
  type,
  address,
  phone,
  email,
  taxId,
}: CounterPartCompanyProps) => (
  <Card
    actions={
      <Button
        color="blue"
        onClick={onEdit}
        leftIcon={<EditIcon fill={'blue'} width={24} height={24} />}
      >
        Edit details
      </Button>
    }
  >
    <Box sx={{ padding: '27px 23px 32px' }}>
      <LabelText label={'Company name'} text={companyName} />
      <LabelText label={'Type'} text={type} />
      <LabelText label={'Business address'} text={address} />
      {phone && <LabelText label={'Phone'} text={phone} />}
      {email && <LabelText label={'E-mail'} text={email} />}
      {taxId && <LabelText label={'Tax ID'} text={taxId} />}
    </Box>
  </Card>
);

export default CounterPartCompany;
