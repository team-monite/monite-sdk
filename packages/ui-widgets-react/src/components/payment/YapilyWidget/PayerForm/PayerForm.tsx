import React from 'react';
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
  PaymentsPaymentsMedia,
  PaymentsPaymentsBank,
} from '@team-monite/sdk-api';

type PayerFormProps = {
  bank?: PaymentsPaymentsBank;
  name: string;
  iban: string;
  onChangeName: (name: string) => void;
  onChangeIban: (iban: string) => void;
  handleNextStep: () => void;
};

const PayerForm = ({
  bank,
  name,
  iban,
  onChangeName,
  onChangeIban,
  handleNextStep,
}: PayerFormProps) => {
  const { t } = useTranslation();

  if (!bank) return null;

  const logo = bank.media.find(
    (item: PaymentsPaymentsMedia) => item.type === 'icon'
  )?.source;

  return (
    <Box>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Avatar size={44} src={logo}></Avatar>
        <Text textSize="h3" mt="12px" textAlign="center">
          {bank?.name}
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
      <Button mt="56px" type="submit" block onClick={handleNextStep}>
        Continue
      </Button>
    </Box>
  );
};

export default PayerForm;
