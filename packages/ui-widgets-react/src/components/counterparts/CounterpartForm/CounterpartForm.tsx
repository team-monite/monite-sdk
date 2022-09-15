import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from '@emotion/styled';
import {
  Box,
  Card,
  Checkbox,
  Input,
  FormField,
  LabelText,
  List,
  ListItem,
  Text,
  UPen,
  UTrashAlt,
  UPlusCircle,
  Button,
} from '@monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useCounterpartList } from 'core/queries/useCounterpart';

/* TODO: make an API request here?
const res = await monite.api.counterparts.create({
  type: CounterpartType.ORGANIZATION,
  organization: {
    legal_name: values.companyName,
    vat_number: values.vatId,
    is_vendor: true,
    is_customer: false,
    registered_address: {
      country: AllowedCountriesCodes.AF,
      city: 'Berlin',
      postal_code: '123',
      state: 'Berlin',
      line1: 'Unter Der Linden',
    },
    contacts: [],
  },
});

console.log(res);
*/
const Form = styled.form`
  > * + * {
    margin-top: 24px;
  }
`;

interface FormValues {
  companyName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  country: string;
  zipcode: string;
  counterpartType: 'customer' | 'vendor';
  vatId: string;
}

const getValidationSchema = () =>
  yup.object().shape({
    companyName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string(),
    address1: yup.string().required(),
    address2: yup.string(),
    city: yup.string().required(),
    state: yup.string(),
    country: yup.string().required(),
    zipcode: yup.string().required(),
    counterpartType: yup.string().required(),
    vatId: yup.string().required(),
  });

const CounterpartsFormCreate = () => {
  const { t } = useComponentsContext();
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(getValidationSchema()),
  });

  const { data } = useCounterpartList();

  console.log(data);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <Form id="counterpartDetails" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="companyName"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:company.companyName')}
            id={field.name}
            error={error?.message}
            required
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:company.email')}
            id={field.name}
            error={error?.message}
            required
          >
            <Input
              {...field}
              id={field.name}
              isInvalid={!!error}
              type="email"
            />
          </FormField>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <FormField label={t('counterparts:company.phone')} id={field.name}>
            <Input {...field} id={field.name} type="tel" />
          </FormField>
        )}
      />

      <Controller
        name="address1"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            error={error?.message}
            label={t('address:addressLine1')}
            id={field.name}
            required
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="address2"
        control={control}
        render={({ field }) => (
          <FormField label={t('address:addressLine2')} id={field.name}>
            <Input {...field} id={field.name} />
          </FormField>
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField label={t('address:city')} id={field.name} required>
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <FormField label={t('address:state')} id={field.name}>
            <Input {...field} id={field.name} />
          </FormField>
        )}
      />
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField label={t('address:country')} id={field.name} required>
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="zipcode"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField label={t('address:zipcode')} id={field.name} required>
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />

      <Controller
        name="counterpartType"
        control={control}
        defaultValue="customer"
        render={({ field: { ref, value, onChange, ...restField } }) => (
          <FormField
            label={`${t('counterparts:actions.setCounterpart')}:`}
            id="counterpartType"
            required
          >
            <List>
              <ListItem>
                <Checkbox
                  {...restField}
                  label={t('counterparts:customer')}
                  id="customer"
                  value="customer"
                  checked={value === 'customer'}
                  onChange={(e) => onChange(e.target.value)}
                />
              </ListItem>
              <ListItem>
                <Checkbox
                  {...restField}
                  label={t('counterparts:vendor')}
                  id="vendor"
                  value="vendor"
                  checked={value === 'vendor'}
                  onChange={(e) => onChange(e.target.value)}
                />
              </ListItem>
            </List>
          </FormField>
        )}
      />

      <Controller
        name="vatId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:company.vatId')}
            id={field.name}
            required
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />

      <Box sx={{ paddingTop: 16 }}>
        <Text textSize="h4">{t('counterparts:contactPersons')}</Text>
        <Box sx={{ paddingTop: 24 }}>
          <Card
            actions={
              <>
                <Button variant={'text'} leftIcon={<UPen />}>
                  {t('common:edit')}
                </Button>
                <Button variant={'text'} leftIcon={<UTrashAlt />}>
                  {t('common:delete')}
                </Button>
              </>
            }
          >
            <Box sx={{ padding: '28px 24px' }}>
              <LabelText
                label={t('counterparts:contact.fullName')}
                text="John Doe"
              />
              <LabelText
                label={t('counterparts:contact.email')}
                text="john@smagency.com"
              />
              <LabelText
                label={t('counterparts:contact.phone')}
                text="+49 176 23455469"
              />
              <LabelText
                label={t('counterparts:contact.address')}
                text="Unter den Linden 63-65, 10117 Berlin, Germany"
              />
            </Box>
          </Card>
        </Box>
      </Box>

      <Box>
        <Card>
          <Box sx={{ padding: '20px 18px 16px' }}>
            <Button variant={'text'} leftIcon={<UPlusCircle />}>
              {t('counterparts:actions.addContactPerson')}
            </Button>
          </Box>
        </Card>
      </Box>
      <Box sx={{ paddingTop: 32 }}>
        <Button type="submit">Create</Button>
      </Box>
    </Form>
  );
};

export default CounterpartsFormCreate;
