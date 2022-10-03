import React from 'react';
import {
  Text,
  Button,
  Box,
  Avatar,
  Flex,
  List,
  ListItem,
} from '@team-monite/ui-kit-react';

import ReactTooltip from 'react-tooltip';
import { useParams } from 'react-router-dom';

import {
  ReceivableResponse,
  PaymentsPaymentsBank,
  PaymentsPaymentsMedia,
} from '@team-monite/sdk-api';

import styles from './styles.module.scss';

type BankFormProps = {
  banks?: PaymentsPaymentsBank[];
  receivableData?: ReceivableResponse;
  onFinish?: (result: any) => void;
};

const infoPanelMap = {
  dataSharing: {
    label: 'Data sharing',
    tip: 'Yapily Connect will retrieve bank data needed to facilitate this payment based on your request and provide this information to [Name of your app].',
  },
  secureConnection: {
    label: 'Secure Connection',
    tip: 'Data is securely accessed in read-only format and only for the purposes of this payment request. This request is a one off, you will not receive any other requests from Yapily Connect for this payment.',
  },
  access: {
    label: 'About the access',
    tip: 'This consent request is a one-off, you will not receive additional requests once completed.',
  },
  authorization: {
    label: 'FCA Authorization',
    tip: 'Yapily Connect Ltd is authorised and regulated by the Financial Conduct Authority under the Payment Service Regulations 2017 [827001] for the provision of Account Information and Payment Initiation services.',
  },
};

const InvoiceDetailes = ({ banks, receivableData }: BankFormProps) => {
  const { code } = useParams();
  const bankData = banks?.find((bank) => bank.code === code);

  const logo = bankData.media.find(
    (item: PaymentsPaymentsMedia) => item.type === 'icon'
  )?.source;

  return (
    <Box>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Avatar size={44} src={logo}></Avatar>
        <Text textSize="h3" mt="12px" textAlign="center">
          {bankData?.name}
        </Text>
      </Flex>
      <List className={styles.detailesBlock}>
        <ListItem>
          <Flex justifyContent="space-between">
            <Box className={styles.label}>Amount</Box>
            {/* TODO: format amount by exponent */}
            <Box className={styles.value}>{receivableData?.total_amount}</Box>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent="space-between">
            <Box className={styles.label}>Account holder’s name</Box>
            {/* @ts-ignore */}
            <Box className={styles.value}>{receivableData?.entity?.name}</Box>
          </Flex>
        </ListItem>

        <ListItem>
          <Flex justifyContent="space-between">
            <Box className={styles.label}>IBAN</Box>
            <Box className={styles.value}>
              {receivableData?.entity_bank_account?.iban}
            </Box>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent="space-between">
            <Box className={styles.label}>Payment reference</Box>
            <Box className={styles.value}>{receivableData?.document_id}</Box>
          </Flex>
        </ListItem>
      </List>

      <ReactTooltip />

      <Text color="grey">
        To easily set up payments from your bank to [Name of your app] , we are
        about to securely re-direct you to your bank where you will be asked to
        confirm the payment via Yapily Connect, an FCA regulated payment
        initiation provider for [Name of your app]. Yapily Connect will share
        these details with your bank, where you will then be asked to confirm
        the following payment setup.
      </Text>
      <Flex mt={1}>
        {Object.keys(infoPanelMap).map((key) => (
          <Box mr={3}>
            <Button
              variant="text"
              color="grey"
              tooltip={{
                // @ts-ignore
                tip: infoPanelMap[key].tip,
              }}
            >
              {/* @ts-ignore */}
              {infoPanelMap[key].label}
            </Button>
          </Box>
        ))}
      </Flex>

      <Button mt="56px" type="submit" block>
        Continue
      </Button>
    </Box>
  );
};

export default InvoiceDetailes;
