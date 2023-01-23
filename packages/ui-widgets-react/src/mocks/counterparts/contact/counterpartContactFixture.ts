import {
  AllowedCountriesCodes,
  CounterpartContactResponse,
} from '@team-monite/sdk-api';

const genCounterpartContactFixture = (
  id: number = 0
): CounterpartContactResponse => ({
  id: `contact-id-${id}`,
  counterpart_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'Ms.',
  first_name: 'Mary',
  last_name: `O'Brien ${id}`,
  email: 'contact@example.org',
  phone: '5551235476',
  is_default: false,
  address: {
    country: AllowedCountriesCodes.DE,
    city: 'Berlin',
    postal_code: '10115',
    state: 'state',
    line1: 'Flughafenstrasse 52',
    line2: '',
  },
});

export const counterpartContactFixture: CounterpartContactResponse =
  genCounterpartContactFixture();

export const counterpartContactListFixture: CounterpartContactResponse[] =
  new Array(2).fill('test').map((_, id) => genCounterpartContactFixture(id));
