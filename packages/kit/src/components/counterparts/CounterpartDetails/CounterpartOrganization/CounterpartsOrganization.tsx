import React, { ReactNode } from 'react';
import { Text } from '@monite/ui';
import { useComponentsContext } from 'core/context/ComponentsContext';

type CounterPartOrganizationProps = {
  company: ReactNode;
  contacts?: ReactNode;
};

const CounterpartsOrganization = ({
  company,
  contacts,
}: CounterPartOrganizationProps) => {
  const { t } = useComponentsContext();

  return (
    <>
      {company}
      {contacts && (
        <Text m={'40px 0 24px'} textSize={'h4'}>
          {t('counterparts:contactPersons')}
        </Text>
      )}
      {contacts}
    </>
  );
};

export default CounterpartsOrganization;
