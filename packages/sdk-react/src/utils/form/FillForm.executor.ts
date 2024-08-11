import { select } from 'react-select-event';

import { fireEvent, screen } from '@testing-library/react';

interface FillFormField {
  /** Executor string which will use to find elements */
  name: string | RegExp;

  /** Type of input */
  type: 'input' | 'dropdown';

  /** Which value we want to set into an input */
  value: string;
}

/**
 * Fill Form executor is responsible for finding
 *  form fields, fill them and fire events.
 * Like filling input, selecting dropdown items and so on
 *
 * ## Example
 * ```typescript
 * test('should fill the form', async () => {
 *   renderWithClient(<MyFormComponent />);
 *
 *   // After this action the form will be found
 *   //  and all fields will be filled
 *   await new FillFormExecutor()
 *    .withField({
 *      name: /Company name/i,
 *      value: 'Updated company name',
 *      type: 'input'
 *    })
 *    .withField({
 *      name: /Email/i,
 *      value: 'test@test.com',
 *      type: 'input',
 *    })
 *    .execute();
 * });
 * ```
 */
export class FillFormExecutor {
  private fields: Array<FillFormField> = [];

  /** Add field to executor pool */
  public withField(field: FillFormField): this {
    this.fields.push(field);

    return this;
  }

  /** Find and execute appropriate events on fields */
  public async execute(): Promise<void> {
    for (const field of this.fields) {
      switch (field.type) {
        case 'input': {
          const htmlElement = screen.getByRole('textbox', {
            name: field.name,
          });

          fireEvent.change(htmlElement, {
            target: {
              value: field.value,
            },
          });

          break;
        }

        case 'dropdown': {
          const htmlElement = screen.getByLabelText(field.name);

          await select(htmlElement, field.value);

          break;
        }
      }
    }
  }
}
