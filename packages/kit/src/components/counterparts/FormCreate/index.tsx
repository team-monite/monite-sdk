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
      <FormField label="Email" id="email" required>
        <Input />
      </FormField>
      <FormField label="VAT ID" id="vatId" required>
        <Input />
      </FormField>
      <FormField label="Phone number" id="phone">
        <Input />
      </FormField>
      <FormField label="Set this counterpart as" id="type" required>
        <ul>
          <li>
            <Checkbox
              label="Customer"
              name="type"
              id="customer"
              value="customer"
            />
          </li>
          <li>
            <Checkbox label="Vendor" name="type" id="vendor" value="vendor" />
          </li>
        </ul>
      </FormField>
      <FormField label="Set this counterpart as" id="contacts">
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
