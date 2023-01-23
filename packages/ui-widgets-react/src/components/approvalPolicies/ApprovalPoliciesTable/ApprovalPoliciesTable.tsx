import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Table,
  UMoneyBill,
  UBuilding,
  UUserSquare,
  UUserCircle,
  ULabel,
  UListUiAlt,
  UUsersAlt,
  TableFooter,
  Button,
  UArrowLeft,
  UArrowRight,
  HeadCellSort,
  SortOrderEnum,
} from '@team-monite/ui-kit-react';
import {
  WorkflowResponseSchema,
  CursorFieldsWorkflows,
  OrderEnum,
} from '@team-monite/sdk-api';
import styled from '@emotion/styled';
import { addDays, format, formatISO } from 'date-fns';

import Filters from './Filters';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useWorkflowsList } from 'core/queries';

import * as Styled from './styles';

import { Sort } from './types';
import { FilterTypes, FilterValue } from '../types';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CREATED_BY,
} from '../consts';

export const StyledWrapper = styled.div<{
  children: React.ReactNode;
}>`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  // for fixed header
  .rc-table,
  .rc-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .rc-table-body {
    flex: 1 1 0;
  }

  td {
    vertical-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface Props {
  onChangeSort?: (params: {
    sort: CursorFieldsWorkflows;
    order: SortOrderEnum | null;
  }) => void;
  onChangeFilter?: (filter: {
    field: keyof FilterTypes;
    value: FilterValue;
  }) => void;
}

const ApprovalPoliciesTable = ({
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
}: Props) => {
  const { t } = useComponentsContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const { data: workflows, isLoading } = useWorkflowsList(
    currentSort ? (currentSort.order as unknown as OrderEnum) : undefined,
    10,
    currentPaginationToken || undefined,
    currentSort ? currentSort.sort : undefined,
    undefined,
    undefined,
    currentFilters[FILTER_TYPE_SEARCH] || undefined,
    undefined,
    undefined,
    currentFilters[FILTER_TYPE_CREATED_BY] || undefined,
    undefined,
    // HACK: api filter parameter 'created_at' requires full match with seconds. Could not be used
    currentFilters[FILTER_TYPE_CREATED_AT]
      ? formatISO(addDays(currentFilters[FILTER_TYPE_CREATED_AT] as Date, 1))
      : undefined,
    currentFilters[FILTER_TYPE_CREATED_AT]
      ? formatISO(currentFilters[FILTER_TYPE_CREATED_AT] as Date)
      : undefined
  );

  useEffect(() => {
    if (currentPaginationToken && workflows?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [workflows]);

  const onPrev = () =>
    setCurrentPaginationToken(workflows?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(workflows?.next_pagination_token || null);

  const onChangeSort = (
    sort: CursorFieldsWorkflows,
    order: SortOrderEnum | null
  ) => {
    setCurrentPaginationToken(null);
    if (order) {
      setCurrentSort({
        sort,
        order,
      });
    } else if (currentSort?.sort === sort && order === null) {
      setCurrentSort(null);
    }

    onChangeSortCallback && onChangeSortCallback({ sort, order });
  };

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
  };

  return (
    <StyledWrapper>
      <Filters onChangeFilter={onChangeFilter} />
      <Table
        loading={isLoading}
        rowKey="id"
        columns={[
          {
            title: (
              <HeadCellSort
                isActive={
                  currentSort?.sort === CursorFieldsWorkflows.POLICY_NAME
                }
                title={t('approvalPolicies:columns.policyName')}
                onChangeOrder={(order) =>
                  onChangeSort(CursorFieldsWorkflows.POLICY_NAME, order)
                }
              />
            ),
            dataIndex: 'policy_name',
            key: 'policy_name',
          },
          {
            title: t('approvalPolicies:columns.triggers'),
            dataIndex: 'trigger',
            key: 'triggers',
            render: (trigger: WorkflowResponseSchema['trigger']) => (
              <Styled.ColumnList>
                {Object.keys(trigger).map((key) => {
                  switch (key) {
                    case 'amount':
                      return (
                        <li key={key}>
                          <UMoneyBill width={18} />
                          &nbsp;{t('approvalPolicies:triggerTypes.amount')}
                        </li>
                      );
                    case 'counterparts':
                      return (
                        <li key={key}>
                          <UBuilding width={18} />
                          &nbsp;
                          {t('approvalPolicies:triggerTypes.counterparts')}
                        </li>
                      );
                    case 'created_by_roles':
                      return (
                        <li key={key}>
                          <UUserSquare width={18} />
                          &nbsp;
                          {t('approvalPolicies:triggerTypes.createByRole')}
                        </li>
                      );
                    case 'created_by_users':
                      return (
                        <li key={key}>
                          <UUserCircle width={18} />
                          &nbsp;
                          {t('approvalPolicies:triggerTypes.createByUser')}
                        </li>
                      );
                    case 'tags':
                      return (
                        <li key={key}>
                          <ULabel width={18} />
                          &nbsp;
                          {t('approvalPolicies:triggerTypes.tags')}
                        </li>
                      );
                    default:
                      return null;
                  }
                })}
              </Styled.ColumnList>
            ),
          },
          {
            title: t('approvalPolicies:columns.rule'),
            dataIndex: 'workflow',
            key: 'rule',
            render: (workflow: WorkflowResponseSchema['workflow']) => (
              <Styled.ColumnList>
                {(() => {
                  switch (workflow[0].call.method) {
                    case 'Payables.request_approval_by_entity_user':
                      return (
                        <li>
                          <UUsersAlt width={18} />
                          &nbsp;
                          {t('approvalPolicies:rulesTypes.usersFromTheList')}
                          &nbsp;(x
                          {workflow[0].call.params.entity_users_to_approve})
                        </li>
                      );
                    case 'Payables.request_approval_by_role_id':
                      return (
                        <li>
                          <UUserSquare width={18} />
                          &nbsp;
                          {t('approvalPolicies:rulesTypes.roleApproval')}
                        </li>
                      );
                    case 'Payables.request_approval_by_chain':
                      return (
                        <li>
                          <UListUiAlt width={18} />
                          &nbsp;
                          {t('approvalPolicies:rulesTypes.approvalChain')}
                        </li>
                      );
                    default:
                      return null;
                  }
                })()}
              </Styled.ColumnList>
            ),
          },
          {
            title: (
              <HeadCellSort
                isActive={
                  currentSort?.sort === CursorFieldsWorkflows.CREATED_AT
                }
                title={t('approvalPolicies:columns.createdAt')}
                onChangeOrder={(order) =>
                  onChangeSort(CursorFieldsWorkflows.CREATED_AT, order)
                }
              />
            ),
            dataIndex: 'created_at',
            key: 'createdAt',
            render: (value: string) =>
              value ? format(new Date(value), 'dd.MM.yyyy') : '',
          },
          {
            title: t('approvalPolicies:columns.createdBy'),
            dataIndex: 'created_by_entity_user',
            key: 'createdBy',
            render: (
              value: WorkflowResponseSchema['created_by_entity_user']
            ) => (
              <Box display="flex">
                <Avatar size={24} src={value.userpic?.url} />
                &nbsp;
                {`${value.first_name} ${value.last_name}`}
              </Box>
            ),
          },
        ]}
        data={workflows?.data}
        scroll={{ y: 'auto' }}
        footer={() => (
          <TableFooter>
            <Button
              variant="contained"
              color="secondary"
              onClick={onPrev}
              disabled={!workflows?.prev_pagination_token}
            >
              <UArrowLeft width={24} height={24} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onNext}
              disabled={!workflows?.next_pagination_token}
            >
              <UArrowRight width={24} height={24} />
            </Button>
          </TableFooter>
        )}
      />
    </StyledWrapper>
  );
};

export default ApprovalPoliciesTable;
