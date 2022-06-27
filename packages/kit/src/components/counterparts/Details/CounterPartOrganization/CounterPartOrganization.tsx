import React, { ReactNode } from 'react';
import { Text } from '@monite/ui';

type CounterPartOrganizationProps = {
  company: ReactNode;
  contacts?: ReactNode;
};

const CounterPartOrganization = ({
  company,
  contacts,
}: CounterPartOrganizationProps) => (
  <>
    {company}
    {contacts && (
      <Text m={'40px 0 24px'} textSize={'h4'}>
        Contact persons
      </Text>
    )}
    {contacts}
  </>
);

export default CounterPartOrganization;
