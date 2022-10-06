import React from 'react';
import {
  Text,
  Button,
  Box,
  Avatar,
  Flex,
  FormField,
  Input,
} from '@team-monite/ui-kit-react';

import { useParams, useNavigate, useLocation } from 'react-router-dom';

import {
  PaymentsPaymentsBank,
  PaymentsPaymentsMedia,
} from '@team-monite/sdk-api';

type PayerFormProps = {
  banks?: PaymentsPaymentsBank[];
};

const PayerForm = ({ banks }: PayerFormProps) => {
  const { code } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const bankData = banks?.find((bank) => bank.code === code);

  if (!bankData) return null;

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

      <Box mt="32px">
        <FormField id="name" label={"Account's holder name"}>
          <Input value="" required />
        </FormField>
      </Box>
      <Box mt="24px">
        <FormField id="iban" label={'IBAN'}>
          <Input value="" required />
        </FormField>
      </Box>

      <Button
        mt="56px"
        type="submit"
        block
        onClick={() => {
          navigate(`../${bankData.code}/confirm${search}`);
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default PayerForm;
