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

import { http, HttpResponse } from 'msw';
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
  http.get<
    {},
    undefined,
    ProductServicePaginationResponse | ErrorSchemaResponse
  >(productsPath, async ({ request }) => {
    const entityId = request.headers.get('x-monite-entity-id');

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Action read for payable not allowed',
          },
        },
        {
          status: 409,
        }
      );
    }

    const url = new URL(request.url);

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

    await delay();

    return HttpResponse.json({
      data: productsPaginatedFixtures,
      prev_pagination_token: prevPage,
      next_pagination_token: nextPage,
    });
  }),

  http.get<
    ProductParams,
    undefined,
    ProductServiceResponse | ErrorSchemaResponse
  >(productByIdPath, async ({ request, params }) => {
    const { productId } = params;
    const entityId = request.headers.get('x-monite-entity-id');

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Access restricted',
          },
        },
        {
          status: 400,
        }
      );
    }

    const productById = productsList.find((item) => item.id === productId);

    if (productById) {
      await delay();

      return HttpResponse.json(productById);
    } else {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Product not found',
          },
        },
        {
          status: 400,
        }
      );
    }
  }),

  http.post<
    {},
    ProductServiceRequest,
    ProductServiceResponse | ErrorSchemaResponse
  >(productsPath, async ({ request }) => {
    const jsonBody = await request.json();

    try {
      await createProductValidationSchema.validate(jsonBody);
    } catch (e) {
      await delay();

      return HttpResponse.json(
        {
          error: { message: 'See errors in the console' },
        },
        {
          status: 400,
        }
      );
    }

    const newProduct = createProduct(jsonBody);

    productsList = [...productsList, newProduct];

    await delay();

    return HttpResponse.json(newProduct);
  }),

  http.patch<
    { productId: string },
    ProductServiceRequest,
    ProductServiceResponse | ErrorSchemaResponse
  >(productByIdPath, async ({ request, params }) => {
    const jsonBody = await request.json();
    const productId = params.productId;

    if (jsonBody.name.includes('error')) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: jsonBody.name,
          },
        },
        {
          status: 403,
        }
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
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: jsonBody.name,
          },
        },
        {
          status: 403,
        }
      );
    }

    await delay();

    return HttpResponse.json(updatedProduct);
  }),

  http.delete<{ productId: string }>(productByIdPath, async ({ params }) => {
    const productId = params.productId;

    productsList = productsList.filter((product) => product.id !== productId);

    await delay();

    return new HttpResponse(null, {
      status: 204,
    });
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
