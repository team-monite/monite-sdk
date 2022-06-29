import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import {
  Box,
  Card,
  Checkbox,
  EditIcon,
  Input,
  FormField,
  LabelText,
  Link,
  List,
  ListItem,
  Text,
  TrashIcon,
  Plus3Icon,
} from '@monite/ui';
import { useComponentsContext } from 'core/context/ComponentsContext';

// export interface CounterpartsFormCreateProps {}

// type FormValues = {
//   companyName: string;
//   vatId: string;
// };

interface Form {
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

const CounterpartsFormCreate = () => {
  const { t } = useComponentsContext();
  const { control, handleSubmit } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = (data) => {
    console.log(data);

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
  };

  return (
    <form id="createCounterpart" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label={t('counterparts:company.companyName')}
        id="companyName"
        required
      >
        <Controller
          name="companyName"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} />
          )}
        />
      </FormField>
      <FormField label={t('counterparts:company.email')} id="email" required>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} type="email" />
          )}
        />
      </FormField>
      <FormField label={t('counterparts:company.phone')} id="phone">
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input {...restField} type="tel" />
          )}
        />
      </FormField>
      <FormField label={t('address:addressLine1')} id="address1" required>
        <Controller
          name="address1"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} />
          )}
        />
      </FormField>
      <FormField label={t('address:addressLine2')} id="address2">
        <Controller
          name="address2"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input {...restField} />
          )}
        />
      </FormField>
      <FormField label={t('address:city')} id="city" required>
        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} />
          )}
        />
      </FormField>
      <FormField label={t('address:state')} id="state">
        <Controller
          name="state"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input {...restField} />
          )}
        />
      </FormField>
      <FormField label={t('address:country')} id="country" required>
        <Controller
          name="country"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} />
          )}
        />
      </FormField>
      <FormField label={t('address:zipcode')} id="zipcode" required>
        <Controller
          name="zipcode"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} />
          )}
        />
      </FormField>
      <FormField
        label={`${t('counterparts:actions.setCounterpart')}:`}
        id="counterpartType"
        required
      >
        <Controller
          name="counterpartType"
          control={control}
          defaultValue="customer"
          render={({ field: { ref, value, onChange, ...restField } }) => (
            <List>
              <ListItem>
                <Checkbox
                  label={t('counterparts:customer')}
                  id="customer"
                  value="customer"
                  checked={value === 'customer'}
                  onChange={(e) => onChange(e.target.value)}
                  {...restField}
                />
              </ListItem>
              <ListItem>
                <Checkbox
                  label={t('counterparts:vendor')}
                  id="vendor"
                  value="vendor"
                  checked={value === 'vendor'}
                  onChange={(e) => onChange(e.target.value)}
                  {...restField}
                />
              </ListItem>
            </List>
          )}
        />
      </FormField>
      <FormField label={t('counterparts:company.vatId')} id="vatId" required>
        <Controller
          name="vatId"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...restField } }) => (
            <Input required {...restField} />
          )}
        />
      </FormField>
      <Box sx={{ paddingTop: 16 }}>
        <Text textSize="h4">{t('counterparts:contactPersons')}</Text>
        <Box sx={{ paddingTop: 24 }}>
          <Card
            actions={
              <>
                <Link
                  color="blue"
                  href="#"
                  leftIcon={<EditIcon fill="blue" width={16} height={16} />}
                >
                  {t('common:edit')}
                </Link>
                <Link
                  color="blue"
                  href="#"
                  leftIcon={<TrashIcon fill="blue" width={16} height={16} />}
                >
                  {t('common:delete')}
                </Link>
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
      <Box sx={{ paddingTop: 24 }}>
        <Card>
          <Box sx={{ padding: '20px 18px 16px' }}>
            <Link
              color="blue"
              href="#"
              leftIcon={<Plus3Icon fill="blue" width={16} height={16} />}
            >
              {t('counterparts:actions.addContactPerson')}
            </Link>
          </Box>
        </Card>
      </Box>
    </form>
  );
};

export default CounterpartsFormCreate;
