import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidIBAN } from 'ibantools';

import {
  Text,
  Button,
  Box,
  Avatar,
  Flex,
  FormField,
  Input,
} from '@team-monite/ui-kit-react';

import { Bank, Media } from '@team-monite/sdk-api';

type PayerFormProps = {
  bank?: Bank;
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
  const [ibanError, setIbanError] = useState(isValidIBAN(iban));
  const [nameError, setNameError] = useState(false);

  if (!bank) return null;

  const logo = bank.media.find((item: Media) => item.type === 'icon')?.source;

  const validateInputs = () => {
    setIbanError(!isValidIBAN(iban));
    setNameError(!name);
    return isValidIBAN(iban) && !!name;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      handleNextStep();
    }
  };

  return (
    <Box>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Avatar size={44} src={logo}></Avatar>
        <Text textSize="h3" mt="12px" textAlign="center">
          {bank?.name}
        </Text>
      </Flex>

      <Box mt="32px">
        <FormField
          id="name"
          label={t('payment:bankWidget.payerFormName')}
          error={nameError ? t('payment:bankWidget:payerFormNameError') : ''}
        >
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
        <FormField
          id="iban"
          label={t('payment:bankWidget.payerFormIban')}
          error={ibanError ? t('payment:bankWidget:payerFormIbanError') : ''}
        >
          <Input
            value={iban}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeIban(e.target.value)
            }
            required
          />
        </FormField>
      </Box>
      <Button mt="56px" type="submit" block onClick={handleSubmit}>
        Continue
      </Button>
    </Box>
  );
};

export default PayerForm;
