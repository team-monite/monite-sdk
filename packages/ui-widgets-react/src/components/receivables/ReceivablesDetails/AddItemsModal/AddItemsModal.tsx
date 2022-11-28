import React, { useState, useMemo } from 'react';
import {
  ReceivablesProductServiceResponse,
  ReceivablesProductServiceTypeEnum,
} from '@team-monite/sdk-api';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Header,
  ListItem,
  Modal,
  ModalLayout,
  Search,
  Select,
  Spinner,
  Text,
} from '@team-monite/ui-kit-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { useProducts } from 'core/queries';

import {
  ItemsFooter,
  ItemsHeader,
  StyledHeaderActions,
  ItemsContent,
  StyledItemsList,
  ItemsFilterWrapper,
  StyledItemsLoaderWrapper,
} from '../ReceivablesDetailsStyle';
import { currencyFormatter } from '../helpers';

type FilterValues = {
  nameContains?: string;
  type?: ReceivablesProductServiceTypeEnum;
};

type FilterTypes = keyof FilterValues;

type Props = {
  onSubmit: (items: ReceivablesProductServiceResponse[]) => void;
  onClose: () => void;
};

const AddItemsModal = ({ onSubmit, onClose }: Props) => {
  const { t, monite } = useComponentsContext();
  const [filter, setFilter] = useState<FilterValues>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const productsQuery = useProducts(
    monite.entityId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    filter.nameContains,
    undefined,
    filter.type
  );
  const products = useMemo(
    () =>
      productsQuery.data?.pages.reduce((prev, page) => {
        return {
          data: [...prev.data, ...page.data],
        };
      }),
    [productsQuery.data]
  );

  const handleSelect = (e: React.BaseSyntheticEvent) => {
    const selectedId = e.target.value;

    setSelectedItems(() => {
      const index = selectedItems.findIndex(
        (item: string, index: number) => selectedItems[index] === selectedId
      );

      if (index === -1) return [...selectedItems, selectedId];
      return selectedItems.filter((item) => item !== selectedId);
    });
  };

  const onChangeFilter = (
    type: FilterTypes,
    value: string | undefined | null
  ) => {
    setFilter((filter) => ({ ...filter, [type]: value || undefined }));
  };

  return (
    <Modal anchor="right">
      <ModalLayout
        size={'md'}
        isDrawer
        header={
          <ItemsHeader>
            <Header>
              <Text textSize="h3">{t('receivables:addItems')}</Text>
            </Header>
          </ItemsHeader>
        }
        footer={
          <ItemsFooter>
            <Header
              actions={
                <StyledHeaderActions>
                  <Button
                    variant={'link'}
                    color={'secondary'}
                    onClick={onClose}
                  >
                    {t('common:cancel')}
                  </Button>
                  <Button
                    onClick={() => {
                      onSubmit(
                        products?.data.filter((item) =>
                          selectedItems.includes(item.id || '')
                        ) || []
                      );
                      onClose();
                    }}
                  >
                    {t('common:add')}
                  </Button>
                </StyledHeaderActions>
              }
            />
          </ItemsFooter>
        }
      >
        <ItemsContent>
          <ItemsFilterWrapper>
            <Box width={200}>
              <Search
                placeholder={t('common:search')}
                isFilter
                onSearch={(search) => onChangeFilter('nameContains', search)}
              />
            </Box>
            <Box width={200}>
              <Select
                placeholder={t('receivables:AllTypes')}
                isFilter
                isClearable
                options={[
                  { label: t('receivables:product'), value: 'product' },
                  { label: t('receivables:service'), value: 'service' },
                ]}
                onChange={(selected) => onChangeFilter('type', selected?.value)}
              />
            </Box>
          </ItemsFilterWrapper>
          <StyledItemsList isLoading={productsQuery.isFetching}>
            {productsQuery.isFetching && (
              <StyledItemsLoaderWrapper>
                <Spinner pxSize={36} />
              </StyledItemsLoaderWrapper>
            )}
            <InfiniteScroll
              height="auto"
              dataLength={productsQuery.data?.pages.length || 0}
              next={() => productsQuery.fetchNextPage()}
              hasMore={!!productsQuery.hasNextPage}
              loader={productsQuery.isLoading}
            >
              {products?.data.map((item) => (
                <ListItem key={item.id || item.name}>
                  <Checkbox
                    fullWidth
                    checked={
                      selectedItems.findIndex((i) => i === item.id) !== -1
                    }
                    label={
                      <Flex justifyContent="space-between">
                        <div>{item.name}</div>
                        <div>
                          {item.price
                            ? currencyFormatter(item.price.currency).format(
                                item.price.value
                              )
                            : null}
                        </div>
                      </Flex>
                    }
                    value={item.id || ''}
                    id={item.id || ''}
                    name={item.name}
                    onChange={handleSelect}
                  />
                </ListItem>
              ))}
            </InfiniteScroll>
          </StyledItemsList>
        </ItemsContent>
      </ModalLayout>
    </Modal>
  );
};

export default AddItemsModal;
