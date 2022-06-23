import React from 'react';
import { Badge, Avatar, Text, TableRow, DropdownItem } from '@monite/ui';

import { CallIcon, AccountIcon, MessageIcon } from '../../../ui';

import * as Styled from './styles';

const Contacts = ({ row }: any) => {
  const data = row[row.type];
  const contacts = (data.contacts || []).map((c: any) => c.first_name);

  return (
    <Styled.ColContacts>
      <div>
        <MessageIcon width={16} height={16} />
        {data.email}
      </div>
      {contacts.length ? (
        <div>
          <AccountIcon width={16} height={16} />
          {contacts.join(', ')}
        </div>
      ) : null}
      <div>
        <CallIcon width={16} height={16} />
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
        <Avatar size={44} onlyLetter name={data?.legal_name[0]} />
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
      <Avatar size={44} onlyLetter name={data?.first_name[0]} />
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
  const data = row[row.type];

  return (
    <TableRow
      dropdownActions={() => (
        <>
          <DropdownItem onClick={() => {}}>Edit</DropdownItem>
          <DropdownItem onClick={() => {}}>Delete</DropdownItem>
        </>
      )}
    >
      <td>
        <ColName row={row} />
      </td>
      <td>
        <Styled.ColType>
          {data.is_customer ? <Badge text="Customer" /> : null}
          {data.is_vendor ? <Badge text="Vendor" /> : null}
        </Styled.ColType>
      </td>
      <td>
        <Contacts row={row} />
      </td>
    </TableRow>
  );
};

export default Row;
