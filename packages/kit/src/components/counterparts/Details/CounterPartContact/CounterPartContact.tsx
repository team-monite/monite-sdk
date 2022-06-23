import DetailsCard from '../Card';
import { Button } from '@monite/ui';
import LabelText from '../LabelText';
import React from 'react';

type CounterPartContactProps = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const CounterPartContact = ({
  fullName,
  phone,
  email,
  address,
}: CounterPartContactProps) => (
  <DetailsCard
    actions={
      <>
        <Button>Call</Button>
        <Button>Send email</Button>
      </>
    }
  >
    <LabelText label={'Full name'} text={fullName} />
    <LabelText label={'Address'} text={address} />
    <LabelText label={'Phone'} text={phone} />
    <LabelText label={'E-mail'} text={email} />
  </DetailsCard>
);

export default CounterPartContact;
