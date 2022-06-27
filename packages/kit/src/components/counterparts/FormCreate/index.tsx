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
            <Checkbox label="Customer" />
          </li>
          <li>
            <Checkbox label="Vendor" />
          </li>
        </ul>
      </FormField>
      <FormField label="Set this counterpart as" required>
        <ul>
          <li>Full name: John Doe</li>
          <li>E-mail: john@smagency.com</li>
          <li>Phone: +49 176 23455469</li>
          <li>
            <Button color="link" text="Edit" />
            <Button color="link" text="Delete" />
          </li>
        </ul>
      </FormField>
      <Button text="Create" />
    </form>
  );
};

export default CounterpartsFormCreate;
