import React from 'react';
import {
  Tag,
  Avatar,
  Text,
  TableRow,
  DropdownItem,
  UPhone,
  UEnvelopeAlt,
  UUserSquare,
} from '@monite/ui';

import { useComponentsContext } from 'core/context/ComponentsContext';

import * as Styled from './styles';

const Contacts = ({ row }: any) => {
  const data = row[row.type];
  const contacts = (data.contacts || []).map((c: any) => c.first_name);

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
};

const ColName = ({ row }: any) => {
  const data = row[row.type];

  if (row.type === 'organization') {
    return (
      <Styled.ColName>
        <Avatar size={44}>{data?.legal_name}</Avatar>
        <div>
          <Text textSize="bold">{data.legal_name}</Text>
          <Styled.AddressText>
            {data?.registered_address?.country} •{' '}
            {data?.registered_address?.city}
          </Styled.AddressText>
        </div>
      </Styled.ColName>
    );
  }

  return (
    <Styled.ColName>
      <Avatar size={44}>{data?.first_name[0]}</Avatar>
      <div>
        <Text textSize="bold">{data?.first_name}</Text>
        <Styled.AddressText>
          {data?.residential_address?.country} •{' '}
          {data?.residential_address?.city}
        </Styled.AddressText>
      </div>
    </Styled.ColName>
  );
};

const Row = ({ row }: any) => {
  const { t } = useComponentsContext();
  const data = row[row.type];

  return (
    <TableRow
      dropdownActions={() => (
        <>
          <DropdownItem onClick={() => {}}>{t('common:edit')}</DropdownItem>
          <DropdownItem onClick={() => {}}>{t('common:delete')}</DropdownItem>
        </>
      )}
    >
      <td>
        <ColName row={row} />
      </td>
      <td>
        <Styled.ColType>
          {data.is_customer && <Tag>{t('counterparts:customer')}</Tag>}
          {data.is_vendor && <Tag>{t('counterparts:vendor')}</Tag>}
        </Styled.ColType>
      </td>
      <td>
        <Contacts row={row} />
      </td>
    </TableRow>
  );
};

export default Row;
