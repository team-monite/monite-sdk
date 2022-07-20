import React from 'react';
import { Button, LabelText, Card, Box, UPen } from '@monite/ui';
import { useComponentsContext } from 'core/context/ComponentsContext';

type CounterPartCompanyProps = {
  onEdit: () => void;
  companyName: string;
  type: string;
  address: string;
  phone?: string;
  email?: string;
  taxId?: string;
};

const CounterpartsCompany = ({
  onEdit,
  companyName,
  type,
  address,
  phone,
  email,
  taxId,
}: CounterPartCompanyProps) => {
  const { t } = useComponentsContext();

  return (
    <Card
      actions={
        <Button
          size={'sm'}
          variant={'text'}
          onClick={onEdit}
          leftIcon={<UPen />}
        >
          {t('counterparts:actions.editDetails')}
        </Button>
      }
    >
      <Box sx={{ padding: '27px 23px 32px' }}>
        <LabelText
          label={t('counterparts:company.companyName')}
          text={companyName}
        />
        <LabelText label={t('counterparts:company.type')} text={type} />
        <LabelText label={t('counterparts:company.address')} text={address} />
        {phone && (
          <LabelText label={t('counterparts:company.phone')} text={phone} />
        )}
        {email && (
          <LabelText label={t('counterparts:company.email')} text={email} />
        )}
        {taxId && (
          <LabelText label={t('counterparts:company.taxId')} text={taxId} />
        )}
      </Box>
    </Card>
  );
};

export default CounterpartsCompany;
