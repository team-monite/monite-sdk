import React from 'react';
import { Badge, Avatar, TableRow, DropdownItem } from '@monite/ui';
import { PayableResponseSchema, PayableStateEnum } from '@monite/js-sdk';

import { useComponentsContext } from 'core/context/ComponentsContext';

import * as Styled from './styles';

const ROW_TO_BADGE_STATUS_MAP = {
  [PayableStateEnum.NEW]: 'success',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'pending',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'pending',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'warning',
  [PayableStateEnum.REJECTED]: 'warning',
};

const Row = ({ row }: { row: PayableResponseSchema }) => {
  const { t } = useComponentsContext();

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

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
        <Styled.Col>
          {/* TODO: Here should be a short Number instead of the long uuid */}
          {row.id}
        </Styled.Col>
      </td>
      <td>
        <Styled.Col>
          {/* TODO: Here we should use the counterpart logo picture url */}
          {row.counterpart_name ? (
            <Avatar size={24} name={row.counterpart_name} textSize="regular" />
          ) : null}
        </Styled.Col>
      </td>
      <td>
        <Styled.Col>
          {row.issued_at ? row.issued_at.split('-').reverse().join('.') : ''}
        </Styled.Col>
      </td>
      <td>
        <Styled.Col>
          {row.due_date ? row.due_date.split('-').reverse().join('.') : ''}
        </Styled.Col>
      </td>
      <td>
        <Styled.Col>
          <Badge
            text={row.status}
            color={ROW_TO_BADGE_STATUS_MAP[row.status]}
          />
        </Styled.Col>
      </td>
      <td>
        <Styled.Col>
          {row.applied_policy ? <Badge text={row.applied_policy} /> : null}
        </Styled.Col>
      </td>
      <td>{row.amount ? formatter.format(row.amount) : ''}</td>
      <td>
        <Styled.Col>
          {/* TODO: Here we should use an Avatar with User name instead of user_id */}
          {row.was_created_by_user_id ? (
            <Avatar
              size={24}
              name={row.was_created_by_user_id}
              textSize="regular"
            />
          ) : null}
        </Styled.Col>
      </td>
    </TableRow>
  );
};

export default Row;
