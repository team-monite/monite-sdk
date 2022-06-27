import React from 'react';

import { Button, Checkbox, Input, FormField } from '@monite/ui';

// import { useComponentsContext } from '../../../core/context/ComponentsContext';

// export interface CounterpartsFormCreateProps {}

// type FormValues = {
//   companyName: string;
//   vatId: string;
// };

const CounterpartsFormCreate = () => {
  // const { monite } = useComponentsContext() || {};

  const onFinish = async (values: unknown) => {
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

  return (
    <form onSubmit={onFinish}>
      <FormField label="Company name" id="companyName" required>
        <Input required />
      </FormField>
      <FormField
        label="Email"
        name="email"
        required
        rules={[{ required: true, message: 'Please input the Email!' }]}
      >
        <Input />
      </FormField>
      <FormField
        label="VAT ID"
        name="vatId"
        id={'vatId'}
        required
        rules={[{ required: true, message: 'Please input the VAT!' }]}
      >
        <Input />
      </FormField>
      <FormField label="Phone number">
        <Input />
      </FormField>
      <FormField label="Set this counterpart as" required>
        <ul>
          <li>
            <Checkbox
              label="Customer"
              name={'customer'}
              id={'customer'}
              value={1}
            />
          </li>
          <li>
            <Checkbox label="Vendor" name={'vendor'} id={'vendor'} value={1} />
          </li>
        </ul>
      </FormField>
      <FormField label="Set this counterpart as" required>
        <ul>
          <li>Full name: John Doe</li>
          <li>E-mail: john@smagency.com</li>
          <li>Phone: +49 176 23455469</li>
          <li>
            <Button color="link">Edit</Button>
            <Button color="link">Delete</Button>
          </li>
        </ul>
      </FormField>
      <Button>Create</Button>
    </form>
  );
};

export default CounterpartsFormCreate;
