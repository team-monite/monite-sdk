import { useForm, FormProvider } from 'react-hook-form';

import { renderWithClient } from '@/utils/test-utils';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';

import {
  JSONFormatterInput,
  JSONFormatterInputProps,
} from './JSONFormatterInput';

describe('JSONFormatterInput', () => {
  const FormComponent = (props: JSONFormatterInputProps) => {
    const methods = useForm();

    return (
      <FormProvider {...methods}>
        <JSONFormatterInput {...props} />
      </FormProvider>
    );
  };

  test('should format JSON display in textarea when the provided string is a valid JSON', async () => {
    renderWithClient(<FormComponent name="test" label="Test" />);

    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: /Test/i,
    });

    fireEvent.change(input, { target: { value: '{"key": "value"}' } });

    fireEvent.blur(input);

    expect(input.value).toBe('{\n  "key": "value"\n}');
  });

  test('should display an error when the provided string is not a valid JSON', () => {
    renderWithClient(<FormComponent name="test" label="Test" />);

    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: /Test/i,
    });

    // The value is an invalid JSON string, missing a property value. JSON.parse will throw an error like "Unexpected token ..."
    fireEvent.change(input, { target: { value: '{ "test": }' } });

    fireEvent.blur(input);

    expect(screen.queryByText(/unexpected token/i)).toBeInTheDocument();
  });
});
