import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import {
  Text,
  Button,
  Box,
  Avatar,
  Flex,
  List,
  ListItem,
} from '@team-monite/ui-kit-react';

import {
  PaymentsPaymentLinkResponse,
  PaymentsPaymentsBank,
  PaymentsPaymentsMedia,
} from '@team-monite/sdk-api';

import usePaymentDetails from '../../PaymentDetails/usePaymentDetails';

type InvoiceDetailsProps = {
  bank?: PaymentsPaymentsBank;
  paymentData: PaymentsPaymentLinkResponse;
};

const StyledLabel = styled(Box)`
  width: 50%;
`;

const StyledValueBlock = styled(Box)`
  width: 50%;
`;

const StyledDetails = styled(List)`
  margin: 32px 0;
`;

const InvoiceDetails = ({ bank, paymentData }: InvoiceDetailsProps) => {
  const { t } = useTranslation();

  const logo = bank?.media.find(
    (item: PaymentsPaymentsMedia) => item.type === 'icon'
  )?.source;

  const { recipient, amount, paymentReference } = usePaymentDetails({
    payment: paymentData,
  });

  const infoPanelMap = {
    dataSharing: {
      label: t('payment:bankWidget.dataSharingLabel'),
      tip: t('payment:bankWidget.dataSharingTip', { name: recipient }),
    },
    secureConnection: {
      label: t('payment:bankWidget.secureConnectionLabel'),
      tip: t('payment:bankWidget.secureConnectionTip'),
    },
    access: {
      label: t('payment:bankWidget.accessLabel'),
      tip: t('payment:bankWidget.accessTip'),
    },
    authorization: {
      label: t('payment:bankWidget.authorizationLabel'),
      tip: t('payment:bankWidget.authorizationTip'),
    },
  };

  return (
    <Box>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Avatar size={44} src={logo}></Avatar>
        <Text textSize="h3" mt="12px" textAlign="center">
          {bank?.name}
        </Text>
      </Flex>
      <StyledDetails>
        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel className={'styles.label'}>
              <Text textSize="small">{t('payment:bankWidget.amount')}</Text>
            </StyledLabel>
            <StyledValueBlock className={'styles.value'}>
              <Text textSize="small">{amount}</Text>
            </StyledValueBlock>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel>
              <Text textSize="small">
                {t('payment:bankWidget.holdersName')}
              </Text>
            </StyledLabel>
            <StyledValueBlock>
              <Text textSize="small">
                {paymentData.recipient?.bank_account?.name}
              </Text>
            </StyledValueBlock>
          </Flex>
        </ListItem>

        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel>
              <Text textSize="small">{t('payment:bankWidget.iban')}</Text>
            </StyledLabel>
            <StyledValueBlock>
              <Text textSize="small">
                {paymentData.recipient?.bank_account?.iban}
              </Text>
            </StyledValueBlock>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent="space-between">
            <StyledLabel>
              <Text textSize="small">
                {t('payment:bankWidget.paymentReference')}
              </Text>
            </StyledLabel>
            <StyledValueBlock>
              <Text textSize="small">{paymentReference}</Text>
            </StyledValueBlock>
          </Flex>
        </ListItem>
      </StyledDetails>

      <Text color="grey" textSize="small">
        {t('payment:bankWidget.yapilyCopy', { name: recipient })}
      </Text>
      <Flex mt={1} flexWrap="wrap" mb="32px">
        {Object.keys(infoPanelMap).map((key, index) => (
          <Box mr={3} key={index}>
            <Button
              variant="text"
              color="grey"
              tooltip={{
                // @ts-ignore
                tip: infoPanelMap[key].tip,
              }}
            >
              {/* @ts-ignore */}
              <Text textSize="small"> {infoPanelMap[key].label}</Text>
            </Button>
          </Box>
        ))}
      </Flex>

      <Button type="submit" block>
        {t('payment:bankWidget.continue')}
      </Button>
    </Box>
  );
};

export default InvoiceDetails;
