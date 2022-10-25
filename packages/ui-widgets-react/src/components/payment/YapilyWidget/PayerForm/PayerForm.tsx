import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Text,
  Button,
  Box,
  Avatar,
  Flex,
  FormField,
  Input,
} from '@team-monite/ui-kit-react';

import {
  PaymentsPaymentsBank,
  PaymentsPaymentsMedia,
  PaymentsPaymentLinkResponse,
} from '@team-monite/sdk-api';

type PayerFormProps = {
  banks?: PaymentsPaymentsBank[];
  paymentData: PaymentsPaymentLinkResponse;
  name: string;
  iban: string;
  onChangeName: (name: string) => void;
  onChangeIban: (iban: string) => void;
};

const PayerForm = ({
  banks,
  name,
  iban,
  onChangeName,
  onChangeIban,
}: PayerFormProps) => {
  const { t } = useTranslation();
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
        <FormField id="name" label={t('payment:bankWidget.payerFormName')}>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeName(e.target.value)
            }
            required
          />
        </FormField>
      </Box>
      <Box mt="24px">
        <FormField id="iban" label={t('payment:bankWidget.payerFormIban')}>
          <Input
            value={iban}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeIban(e.target.value)
            }
            required
          />
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
