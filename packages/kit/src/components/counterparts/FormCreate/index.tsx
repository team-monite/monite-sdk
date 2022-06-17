import React from 'react';

// @ts-ignore
import { Button } from '@monite/ui';

// import { useComponentsContext } from '../../../core/context/ComponentsContext';

import './styles.less';
import {
  Form,
  FormItem,
  Input,
  Button as OldButton,
  ListItem,
  List,
  Checkbox,
  Values,
} from '../../../ui';

// export interface CounterpartsFormCreateProps {}

type FormValues = {
  companyName: string;
  vatId: string;
};

const CounterpartsFormCreate = () => {
  // const { monite } = useComponentsContext() || {};

  const onFinish = async (values: FormValues) => {
    console.log(values);

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

  const onFinishFailed = (errorInfo: any) => {
    // TODO
    console.log('Failed:', errorInfo);
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
      <FormItem
        label="Company name"
        name="companyName"
        required
        rules={[{ required: true, message: 'Please input the Company name!' }]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Email"
        name="email"
        required
        rules={[{ required: true, message: 'Please input the Email!' }]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="VAT ID"
        name="vatId"
        required
        rules={[{ required: true, message: 'Please input the VAT!' }]}
      >
        <Input />
      </FormItem>
      <FormItem label="Phone number">
        <Input />
      </FormItem>
      <FormItem label="Set this counterpart as" required>
        <List bordered>
          <ListItem>
            <Checkbox>Customer</Checkbox>
          </ListItem>
          <ListItem>
            <Checkbox>Vendor</Checkbox>
          </ListItem>
        </List>
      </FormItem>
      <FormItem label="Set this counterpart as" required>
        <List bordered>
          <ListItem>
            <Values
              data={[
                {
                  label: 'Full name',
                  value: 'John Doe',
                },
                {
                  label: 'E-mail',
                  value: 'john@smagency.com',
                },
                {
                  label: 'Phone',
                  value: '+49 176 23455469',
                },
              ]}
            />
          </ListItem>
          <ListItem>
            <OldButton type="link">Edit</OldButton>
            <OldButton type="link">Delete</OldButton>
          </ListItem>
        </List>
      </FormItem>
      <Button text="Create" />
    </Form>
  );
};

export default CounterpartsFormCreate;
