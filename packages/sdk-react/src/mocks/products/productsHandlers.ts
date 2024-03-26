import {
  ENTITY_ID_FOR_ABSENT_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
} from '@/mocks';
import { delay, filterByPageAndLimit } from '@/mocks/utils';
import {
  OrderEnum,
  CurrencyEnum,
  ErrorSchemaResponse,
  ProductServiceResponse,
  ProductServicePaginationResponse,
  PRODUCTS_ENDPOINT,
  ProductServiceRequest,
} from '@monite/sdk-api';

import { rest } from 'msw';
import * as yup from 'yup';

import { createProduct, productsListFixture } from './productsFixtures';

type ProductParams = { productId: string };

const productsPath = `*/${PRODUCTS_ENDPOINT}`;
const productByIdPath = `${productsPath}/:productId`;

let productsList = productsListFixture;

const createProductValidationSchema = yup.object({
  name: yup.string().required(),
  price: yup.object({
    value: yup.number().required(),
    currency: yup.string().required(),
  }),
  type: yup.string().required(),
  measure_unit_id: yup.string().required(),
});

export const productsHandlers = [
  rest.get<
    undefined,
    {},
    ProductServicePaginationResponse | ErrorSchemaResponse
  >(productsPath, ({ url, headers }, res, ctx) => {
    const entityId = headers.get('x-monite-entity-id');

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      return res(
        ctx.status(409),
        ctx.json({
          error: {
            message: 'Action read for payable not allowed',
          },
        })
      );
    }

    const filteredProductsFixture = (() => {
      let filtered: typeof productsList;

      filtered = filterByCurrency(
        url.searchParams.get('currency') as CurrencyEnum,
        productsList
      );

      if (url.searchParams.get('sort') && url.searchParams.get('order')) {
        filtered = filtered.sort((a, b) =>
          sortByName(a, b, url.searchParams.get('order') as OrderEnum)
        );
      }

      if (url.searchParams.get('type')) {
        filtered = filtered.filter(
          (product) => product.type === url.searchParams.get('type')
        );
      }

      if (url.searchParams.get('name__icontains')) {
        filtered = filtered.filter((product) => {
          return product.name
            .toLowerCase()
            .includes(url.searchParams.get('name__icontains')!.toLowerCase());
        });
      }

      if (url.searchParams.get('measure_unit_id')) {
        filtered = filtered.filter((product) => {
          return (
            product.measure_unit_id === url.searchParams.get('measure_unit_id')
          );
        });
      }

      return filtered;
    })();

    const limit = Number(url.searchParams.get('limit') ?? '10');

    const [productsPaginatedFixtures, { prevPage, nextPage }] =
      filterByPageAndLimit<ProductServiceResponse>(
        {
          page: url.searchParams.get('pagination_token'),
          limit,
        },
        filteredProductsFixture
      );

    return res(
      delay(1_000),
      ctx.json({
        data: productsPaginatedFixtures,
        prev_pagination_token: prevPage,
        next_pagination_token: nextPage,
      })
    );
  }),

  rest.get<
    undefined,
    ProductParams,
    ProductServiceResponse | ErrorSchemaResponse
  >(productByIdPath, ({ params, headers }, res, ctx) => {
    const { productId } = params;
    const entityId = headers.get('x-monite-entity-id');

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Access restricted',
          },
        })
      );
    }

    const productById = productsList.find((item) => item.id === productId);

    if (productById) {
      return res(delay(), ctx.json(productById));
    } else {
      return res(
        delay(),
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Product not found',
          },
        })
      );
    }
  }),

  rest.post<
    ProductServiceRequest,
    {},
    ProductServiceResponse | ErrorSchemaResponse
  >(productsPath, async (req, res, ctx) => {
    const jsonBody = await req.json<ProductServiceRequest>();

    try {
      await createProductValidationSchema.validate(jsonBody);
    } catch (e) {
      console.error(e);
      return res(
        delay(),
        ctx.status(400),
        ctx.json({ error: { message: 'See errors in the console' } })
      );
    }

    const newProduct = createProduct(jsonBody);

    productsList = [...productsList, newProduct];

    return res(delay(), ctx.json(newProduct));
  }),

  rest.patch<
    ProductServiceRequest,
    { productId: string },
    ProductServiceResponse | ErrorSchemaResponse
  >(productByIdPath, async (req, res, ctx) => {
    const jsonBody = await req.json<ProductServiceRequest>();
    const productId = req.params.productId;

    if (jsonBody.name.includes('error')) {
      return res(
        ctx.status(403),
        ctx.json({
          error: {
            message: jsonBody.name,
          },
        })
      );
    }

    productsList = productsList.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          name: jsonBody.name,
          type: jsonBody.type,
          measure_unit_id: jsonBody.measure_unit_id,
          smallest_amount: jsonBody.smallest_amount,
          price: jsonBody.price,
          description: jsonBody.description,
        };
      }

      return product;
    });

    const updatedProduct = productsList.find(
      (product) => product.id === productId
    );

    if (!updatedProduct) {
      return res(
        delay(),
        ctx.status(403),
        ctx.json({
          error: {
            message: jsonBody.name,
          },
        })
      );
    }

    return res(ctx.json(updatedProduct));
  }),

  rest.delete<
    undefined,
    { productId: string },
    ProductServiceResponse | ErrorSchemaResponse
  >(productByIdPath, (req, res, ctx) => {
    const productId = req.params.productId;

    productsList = productsList.filter((product) => product.id !== productId);

    return res(ctx.status(204));
  }),
];

const filterByCurrency = (
  currency: CurrencyEnum | string,
  fixtures: typeof productsListFixture
) => {
  if (!currency) return fixtures;

  if (!Object.values(CurrencyEnum).includes(currency as CurrencyEnum))
    throw new Error('Invalid currency');

  return fixtures.filter((product) => product.price?.currency === currency);
};

function sortByName<T extends { name: string }>(
  a: T,
  b: T,
  order: OrderEnum | null
) {
  const compareResult = a.name.localeCompare(b.name);

  if (order === OrderEnum.ASC) {
    return compareResult;
  } else if (order === OrderEnum.DESC) {
    return -compareResult;
  }

  return 0;
}
