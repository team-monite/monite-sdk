import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Table,
  Tag,
  Text,
  UEnvelopeAlt,
  UPhone,
  UUserSquare,
  Button,
  // HeadCellSort,
  // SortOrderEnum,
  UArrowLeft,
  UArrowRight,
  DropdownItem,
} from '@monite/ui-kit-react';

import {
  CounterpartIndividual,
  CounterpartOrganization,
  CounterpartResponse,
  CounterpartType,
} from '@monite/sdk-api';

import {
  useCounterpartList,
  useDeleteCounterpartById,
} from 'core/queries/useCounterpart';
import { useComponentsContext } from 'core/context/ComponentsContext';

import ConfirmDeleteDialogue from './ConfirmDeleteDialogue';
import { getName } from '../helpers';

import * as Styled from './styles';

import { MONITE_ENTITY_ID, PAGE_LIMIT } from '../../../constants';

export interface CounterpartsTableProps {
  data?: CounterpartResponse[];
}

type CounterpartsTableRow = CounterpartResponse & {
  key: string;
};

const CounterpartsTable = ({ data }: CounterpartsTableProps) => {
  const { t } = useComponentsContext();

  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
  const [selectedCounterpart, setSelectedCounterpart] = useState<
    CounterpartResponse | undefined
  >();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  // const [currentSort, setCurrentSort] = useState<Sort | null>(null);
  // const [currentFilter, setCurrentFilter] = useState<Filters>({});

  const {
    data: counterparts,
    isLoading,
    isRefetching,
    refetch,
  } = useCounterpartList(
    MONITE_ENTITY_ID,
    undefined,
    undefined,
    PAGE_LIMIT,
    currentPaginationToken || undefined
  );
  // xMoniteEntityId: string,
  // iban?: string,
  // order?: OrderEnum,
  // limit: number = 100,
  // paginationToken?: string,
  // sort?: Receivablesapi__v1__counterparts__pagination__CursorFields,
  // type?: ReceivablesCounterpartType,
  // counterpartName?: string,
  // counterpartNameContains?: string,
  // counterpartNameIcontains?: string,
  // isVendor?: boolean,
  // isCustomer?: boolean,
  // email?: string,
  // emailContains?: string,
  // emailIcontains?: string,
  // createdAt?: string,
  // createdAtGt?: string,
  // createdAtLt?: string,
  // createdAtGte?: string,
  // createdAtLte?: string

  useEffect(() => {
    refetch();
  }, [currentPaginationToken]);

  const onPrev = () =>
    setCurrentPaginationToken(counterparts?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(counterparts?.next_pagination_token || null);

  const deleteCounterpartMutation = useDeleteCounterpartById(
    selectedCounterpart!,
    MONITE_ENTITY_ID
  );

  return (
    <>
      <Styled.Table clickableRow={true}>
        {/* <FiltersComponent onChangeFilter={onChangeFilter} /> */}
        <Table
          loading={isLoading || isRefetching}
          rowKey="id"
          columns={[
            {
              title: t('counterparts:columns.name'),
              dataIndex: 'name',
              key: 'name',
              render: (value, row) => {
                const type: CounterpartType = (row as CounterpartsTableRow)
                  .type;
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
                const type: CounterpartType = (row as CounterpartsTableRow)
                  .type;
                const data: CounterpartIndividual | CounterpartOrganization = (
                  row as any
                )[type];

                return (
                  <Styled.ColType>
                    {data.is_customer && (
                      <Tag>{t('counterparts:customer')}</Tag>
                    )}
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
                const type: CounterpartType = (row as CounterpartsTableRow)
                  .type;
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
          //TODO: doesn't work, fix it'
          renderDropdownActions={(value: any) => {
            return (
              <>
                <DropdownItem onClick={() => {}}>
                  {t('counterparts:actions.edit')}
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelectedCounterpart(value);
                    setOpenDeleteDialogue(true);
                  }}
                >
                  {t('counterparts:actions.delete')}
                </DropdownItem>
              </>
            );
          }}
          // data={prepareDataForTable()}
          data={counterparts?.data}
          onRow={(record) => ({
            onClick: () => console.log('onRowClick', record),
          })}
          scroll={{ y: 'auto' }}
          footer={() => (
            <Styled.Footer>
              <Button
                variant="contained"
                color="secondary"
                onClick={onPrev}
                disabled={!counterparts?.prev_pagination_token}
              >
                <UArrowLeft width={24} height={24} />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onNext}
                disabled={!counterparts?.next_pagination_token}
              >
                <UArrowRight width={24} height={24} />
              </Button>
            </Styled.Footer>
          )}
        />
      </Styled.Table>
      {openDeleteDialogue && (
        <ConfirmDeleteDialogue
          onClose={() => {
            setOpenDeleteDialogue(false);
            setSelectedCounterpart(undefined);
          }}
          onDelete={() => {
            deleteCounterpartMutation.mutate();
            setOpenDeleteDialogue(false);
            setSelectedCounterpart(undefined);
          }}
          name={selectedCounterpart ? getName(selectedCounterpart) : ''}
        />
      )}
    </>
  );
};

export default CounterpartsTable;
