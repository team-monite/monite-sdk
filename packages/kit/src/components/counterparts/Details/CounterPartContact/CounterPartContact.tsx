import React from 'react';
import { LabelText, Card, MailIcon, CallIcon, Link } from '@monite/ui';

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
  <Card
    content={
      <>
        <LabelText label={'Full name'} text={fullName} />
        <LabelText label={'Address'} text={address} />
        <LabelText label={'Phone'} text={phone} />
        <LabelText label={'E-mail'} text={email} />
      </>
    }
    actions={
      <>
        <Link
          color="blue"
          href={`tel:${phone}`}
          leftIcon={<CallIcon width={18} height={18} fill={'blue'} />}
        >
          Call
        </Link>
        <Link
          color="blue"
          href={`mailto:${email}`}
          height="14px"
          leftIcon={<MailIcon width={18} height={18} fill={'blue'} />}
        >
          Send email
        </Link>
      </>
    }
  />
);

export default CounterPartContact;
