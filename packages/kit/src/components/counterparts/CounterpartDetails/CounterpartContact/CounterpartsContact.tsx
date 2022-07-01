import React from 'react';
import { LabelText, Card, MailIcon, CallIcon, Link, Box } from '@monite/ui';
import { useComponentsContext } from 'core/context/ComponentsContext';

type CounterPartContactProps = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const CounterpartsContact = ({
  fullName,
  phone,
  email,
  address,
}: CounterPartContactProps) => {
  const { t } = useComponentsContext();

  return (
    <Card
      actions={
        <>
          <Link href={`tel:${phone}`} leftIcon={<CallIcon />}>
            {t('counterparts:actions.call')}
          </Link>
          <Link href={`mailto:${email}`} leftIcon={<MailIcon />}>
            {t('counterparts:actions.sendEmail')}
          </Link>
        </>
      }
    >
      <Box sx={{ padding: '27px 23px 32px' }}>
        <LabelText label={t('counterparts:contact.fullName')} text={fullName} />
        <LabelText label={t('counterparts:contact.address')} text={address} />
        <LabelText label={t('counterparts:contact.phone')} text={phone} />
        <LabelText label={t('counterparts:contact.email')} text={email} />
      </Box>
    </Card>
  );
};

export default CounterpartsContact;
