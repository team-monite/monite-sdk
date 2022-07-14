import React from 'react';
import styled from '@emotion/styled';
import { Text, Input, FormField, Button, Box, Avatar, Flex } from '@monite/ui';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { toast } from 'ui/toast';

const Form = styled.form`
  > * + * {
    margin-top: 24px;
  }
`;

const getValidationSchema = () => {
  return yup
    .object({
      amount: yup.number().required(),
      holder: yup.string().required(),
    })
    .required();
};

interface IFormInputs {
  amount: string;
  holder: string;
  iban: string;
  reference: string;
}

type BankFormProps = {
  bankId: string;
  onFinish?: (result: any) => void;
};
const BankForm = ({ bankId, onFinish }: BankFormProps) => {
  const { control, handleSubmit, formState, getValues } = useForm<IFormInputs>({
    resolver: yupResolver(getValidationSchema()),
    mode: 'onChange',
  });

  const onSubmit = async (data: IFormInputs) => {
    const values = getValues();

    // TODO: here we should make a real API request to create a payment intent using the consentToken
    toast(JSON.stringify(values));

    if (onFinish) {
      onFinish({ status: 'succeeded' });
    }
  };

  const { errors, isSubmitting } = formState;

  return (
    <Box mt="32px">
      <Flex
        mb="32px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Avatar size={44} name={bankId} onlyLetter />
        <Text textSize="h3" mt="12px" textAlign="center">
          {bankId}
        </Text>
      </Flex>
      <Form method="post" onSubmit={handleSubmit(onSubmit)}>
        <FormField id="amount" label="Amount">
          <Controller
            name="amount"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <Input
                  id="amount"
                  required
                  isInvalid={!!errors.amount}
                  {...field}
                />
              );
            }}
          />
        </FormField>

        <FormField id="holder" label="Account holder’s name">
          <Controller
            name="holder"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <Input
                  id="holder"
                  required
                  isInvalid={!!errors.holder}
                  {...field}
                />
              );
            }}
          />
        </FormField>

        <FormField id="iban" label="IBAN">
          <Controller
            name="iban"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <Input
                  id="iban"
                  required
                  isInvalid={!!errors.iban}
                  {...field}
                />
              );
            }}
          />
        </FormField>

        <FormField id="reference" label="Payment reference">
          <Controller
            name="reference"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <Input
                  id="reference"
                  required
                  isInvalid={!!errors.reference}
                  {...field}
                />
              );
            }}
          />
        </FormField>

        <Button
          mt="56px"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          block
        >
          Continue
        </Button>
      </Form>
    </Box>
  );
};

export default BankForm;
