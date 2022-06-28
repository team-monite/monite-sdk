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
          <Link
            color="blue"
            href={`tel:${phone}`}
            leftIcon={<CallIcon width={18} height={18} fill={'blue'} />}
          >
            {t('counterparts:actions.call')}
          </Link>
          <Link
            color="blue"
            href={`mailto:${email}`}
            height="14px"
            leftIcon={<MailIcon width={18} height={18} fill={'blue'} />}
          >
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
