import React, { useState } from 'react';
import { ReceivablesProductServiceResponse } from '@team-monite/sdk-api';
import {
  Button,
  Checkbox,
  Flex,
  Header,
  List,
  ListItem,
  Modal,
  ModalLayout,
  Text,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { useProducts } from 'core/queries';

import {
  ItemsFooter,
  ItemsHeader,
  StyledHeaderActions,
  ItemsContent,
} from '../ReceivablesDetailsStyle';

type Props = {
  onSubmit: (items: ReceivablesProductServiceResponse[]) => void;
  onClose: () => void;
};

const AddItemsModal = ({ onSubmit, onClose }: Props) => {
  const { t, monite } = useComponentsContext();
  const productsQuery = useProducts(monite.entityId);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
                        productsQuery.data?.data?.filter((item) =>
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
          <List>
            {productsQuery.data?.data?.map((item) => (
              <ListItem key={item.id || item.name}>
                <Checkbox
                  fullWidth
                  checked={selectedItems.findIndex((i) => i === item.id) !== -1}
                  label={
                    <Flex justifyContent="space-between">
                      <div>{item.name}</div>
                      <div>{`${item.price?.value} ${item.price?.currency}`}</div>
                    </Flex>
                  }
                  value={item.id || ''}
                  id={item.id || ''}
                  name={item.name}
                  onChange={handleSelect}
                />
              </ListItem>
            ))}
          </List>
        </ItemsContent>
      </ModalLayout>
    </Modal>
  );
};

export default AddItemsModal;
