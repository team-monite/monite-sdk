import React from 'react';
import {
  Avatar,
  Table,
  Tag,
  Text,
  UEnvelopeAlt,
  UPhone,
  UUserSquare,
} from '@monite/ui-kit-react';
import {
  CounterpartIndividual,
  CounterpartOrganization,
  CounterpartResponse,
  CounterpartType,
} from '@monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';

import * as Styled from './styles';

export interface CounterpartsTableProps {
  data?: CounterpartResponse[];
}

type CounterpartsTableRow = CounterpartResponse & {
  key: string;
};

const CounterpartsTable = ({ data }: CounterpartsTableProps) => {
  const { t } = useComponentsContext();

  const prepareDataForTable = (): CounterpartsTableRow[] => {
    return (data || []).map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  return (
    <Styled.Table>
      <Table
        columns={[
          {
            title: t('counterparts:columns.name'),
            dataIndex: 'name',
            key: 'name',
            render: (value, row) => {
              const type: CounterpartType = (row as CounterpartsTableRow).type;
              const data: CounterpartIndividual | CounterpartOrganization = (
                row as any
              )[type];

              if (type === CounterpartType.ORGANIZATION) {
                const orgData = data as CounterpartOrganization;

                return (
                  <Styled.ColName>
                    <Avatar size={44}>{orgData?.legal_name}</Avatar>
                    <div>
                      <Text textSize="bold">{orgData.legal_name}</Text>
                      <Styled.AddressText>
                        {orgData?.registered_address?.country} •{' '}
                        {orgData?.registered_address?.city}
                      </Styled.AddressText>
                    </div>
                  </Styled.ColName>
                );
              }

              const indData = data as CounterpartIndividual;

              return (
                <Styled.ColName>
                  <Avatar size={44}>{indData?.first_name[0]}</Avatar>
                  <div>
                    <Text textSize="bold">{indData?.first_name}</Text>
                    <Styled.AddressText>
                      {indData?.residential_address?.country} •{' '}
                      {indData?.residential_address?.city}
                    </Styled.AddressText>
                  </div>
                </Styled.ColName>
              );
            },
          },
          {
            title: t('counterparts:columns.type'),
            dataIndex: 'type',
            key: 'type',
            render: (value, row) => {
              const type: CounterpartType = (row as CounterpartsTableRow).type;
              const data: CounterpartIndividual | CounterpartOrganization = (
                row as any
              )[type];

              return (
                <Styled.ColType>
                  {data.is_customer && <Tag>{t('counterparts:customer')}</Tag>}
                  {data.is_vendor && <Tag>{t('counterparts:vendor')}</Tag>}
                </Styled.ColType>
              );
            },
          },
          {
            title: t('counterparts:columns.contacts'),
            dataIndex: 'contacts',
            key: 'contacts',
            render: (value, row) => {
              const type: CounterpartType = (row as CounterpartsTableRow).type;
              const data: CounterpartIndividual | CounterpartOrganization = (
                row as any
              )[type];

              if (type === CounterpartType.ORGANIZATION) {
                const contacts = (
                  (data as CounterpartOrganization).contacts || []
                ).map((c: any) => c.first_name);

                return (
                  <Styled.ColContacts>
                    <div>
                      <UEnvelopeAlt width={16} height={16} />
                      {data.email}
                    </div>
                    {contacts.length ? (
                      <div>
                        <UUserSquare width={16} height={16} />
                        {contacts.join(', ')}
                      </div>
                    ) : null}
                    <div>
                      <UPhone width={16} height={16} />
                      {data.phone}
                    </div>
                  </Styled.ColContacts>
                );
              }

              return null;
            },
          },
        ]}
        data={prepareDataForTable()}
      />
    </Styled.Table>
  );
};

export default CounterpartsTable;
