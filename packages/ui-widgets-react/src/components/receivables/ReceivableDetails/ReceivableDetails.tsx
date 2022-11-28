import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Text,
  IconButton,
  ModalLayout,
  UMultiply,
  Header,
  Tag,
  Loading,
  Modal,
  Avatar,
  Box,
  UFile,
  Flex,
} from '@team-monite/ui-kit-react';

import { useReceivableById } from 'core/queries/useReceivables';

import ReceivableItemsInfo from './ReceivableItemsInfo';
import ReceivableTotalInfo from './ReceivableTotalInfo';

import { ROW_TO_TAG_STATUS_MAP } from '../consts';

import {
  StyledHeaderContent,
  ReceivableDetailsHeader,
} from './ReceivableDetailsStyle';

export interface ReceivableDetailsProps {
  id: string;
  onClose?: () => void;
}

const ReceivableDetails = ({ id, onClose }: ReceivableDetailsProps) => {
  const { t } = useTranslation();
  const { data: receivable, error, isLoading } = useReceivableById(id);

  if (isLoading)
    return (
      <Modal anchor={'right'}>
        <ModalLayout scrollableContent size={'md'} isDrawer>
          <Loading />
        </ModalLayout>
      </Modal>
    );

  if (error || !receivable) {
    return (
      <Modal anchor={'right'}>
        <ModalLayout
          scrollableContent
          size={'md'}
          isDrawer
          header={
            <ReceivableDetailsHeader>
              <Header
                rightBtn={
                  <IconButton onClick={onClose} color={'black'}>
                    <UMultiply size={18} />
                  </IconButton>
                }
              >
                {error?.message}
              </Header>
            </ReceivableDetailsHeader>
          }
        >
          {error?.message}
        </ModalLayout>
      </Modal>
    );
  }

  return (
    <Modal anchor={'right'}>
      <ModalLayout
        scrollableContent
        size={'md'}
        isDrawer
        header={
          <ReceivableDetailsHeader>
            <Header
              rightBtn={
                <IconButton onClick={onClose} color={'black'}>
                  <UMultiply size={18} />
                </IconButton>
              }
            >
              <StyledHeaderContent>
                <Avatar size={44}>{receivable?.counterpart_name || '/'}</Avatar>
                <Text textSize={'h3'}>{`${t('receivables:invoice')} ${
                  receivable.document_id || ''
                }`}</Text>
                <Tag color={ROW_TO_TAG_STATUS_MAP[receivable.status]}>
                  {t(`receivables:statuses.${receivable.status}`)}
                </Tag>
              </StyledHeaderContent>
            </Header>
          </ReceivableDetailsHeader>
        }
      >
        {receivable?.line_items?.length === 0 ? (
          <Flex
            height={'100%'}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={64}
          >
            <Box mb={28}>
              <UFile width={64} height={64} color="lightGrey" />
            </Box>
            <Text textSize="h3">{t('receivables:emptyDetails')}</Text>
          </Flex>
        ) : (
          <>
            <ReceivableItemsInfo receivable={receivable} />
            <ReceivableTotalInfo receivable={receivable} />
          </>
        )}
      </ModalLayout>
    </Modal>
  );
};

export default ReceivableDetails;
