import { components } from '@/api';
import { entityUserByIdFixture } from '@/mocks/entityUsers/entityUserByIdFixture';
import { faker } from '@faker-js/faker';

export const generateLineItem = (
  payableId?: string,
  lineItem?: Partial<LineItemResponse>
): LineItemResponse => {
  const price = Number(faker.commerce.price({ min: 1000, max: 100000 }));
  const quantity = Number(faker.number.int({ min: 1, max: 10 }));
  const tax = Number(faker.commerce.price({ min: 0, max: 100 }));

  const total = (price + price * (tax / 100)) * quantity;
  const subtotal = price * quantity;
  const tax_amount = price * (tax / 100) * quantity;

  return {
    id: lineItem?.id ?? faker.string.uuid(),
    name: lineItem?.name ?? faker.commerce.productName(),
    description: lineItem?.description ?? faker.commerce.productDescription(),
    quantity: lineItem?.quantity ?? quantity,
    tax: lineItem?.tax ?? tax,
    unit_price: lineItem?.unit_price ?? price,
    was_created_by_user_id: entityUserByIdFixture.id,
    total: lineItem?.total ?? total,
    tax_amount: lineItem?.tax_amount ?? tax_amount,
    subtotal: lineItem?.subtotal ?? subtotal,
    payable_id: payableId || lineItem?.payable_id || faker.string.uuid(),
  };
};

export const lineItemFixture = generateLineItem();

type LineItemResponse = components['schemas']['LineItemResponse'];
