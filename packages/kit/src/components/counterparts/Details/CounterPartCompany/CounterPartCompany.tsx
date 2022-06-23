import DetailsCard from '../Card';
import { Button } from '@monite/ui';
import LabelText from '../LabelText';
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
  <DetailsCard actions={<Button onClick={onEdit}>Edit details</Button>}>
    <LabelText label={'Company name'} text={companyName} />
    <LabelText label={'Type'} text={type} />
    <LabelText label={'Business address'} text={address} />
    {phone && <LabelText label={'Phone'} text={phone} />}
    {email && <LabelText label={'E-mail'} text={email} />}
    {taxId && <LabelText label={'Tax ID'} text={taxId} />}
  </DetailsCard>
);

export default CounterPartCompany;
