import { components } from '@/api';
import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  generateRandomDate,
  generateRandomId,
  getRandomProperty,
} from '@/utils/storybook-utils';

import { http, HttpResponse, delay } from 'msw';

import { tagListFixture } from './tagsFixture';

let tagsList = tagListFixture;

const tagsPath = `*/tags`;

interface TagDeleteRequest {
  /** Tag identifier. But if it's `true` then the response should be with error */
  id: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}

interface GetRequest {
  order: 'desc' | 'asc';
  limit: string;
  sort: 'updated_at' | 'created_at';
  pagination_token: string;
}

export const tagsHandlers = [
  /**
   * Get all tags
   *
   * Also supports sorting, limits and ordering
   */
  http.get<GetRequest, undefined, TagsPaginationResponse>(
    tagsPath,
    async ({ request }) => {
      const url = new URL(request.url);
      const sort = (url.searchParams.get('sort') as GetRequest['sort']) || null;

      const order =
        (url.searchParams.get('order') as GetRequest['order']) || null;

      const limit =
        (url.searchParams.get('limit') as GetRequest['limit']) || null;

      const pagination_token =
        (url.searchParams.get(
          'pagination_token'
        ) as GetRequest['pagination_token']) || null;

      let next_pagination_token = undefined;
      let prev_pagination_token = undefined;

      const filteredData = (() => {
        const parsedLimit = Number(limit);

        /** We should return next elements */
        if (pagination_token === '1') {
          next_pagination_token = undefined;
          prev_pagination_token = '-1';

          return tagsList.slice(parsedLimit);
        }

        /** We should return first `limit` elements */
        next_pagination_token = '1';
        prev_pagination_token = undefined;

        return tagsList.slice(0, parsedLimit);
      })();

      const sortedData = filteredData.sort((a, b) => {
        if (sort === null) {
          return 0;
        }

        const aTime = new Date(a[sort]);
        const bTime = new Date(b[sort]);

        if (order === 'desc') {
          return bTime.getTime() - aTime.getTime();
        } else if (order === 'asc') {
          return aTime.getTime() - bTime.getTime();
        }

        return 0;
      });

      await delay();

      return HttpResponse.json({
        data: sortedData,
        next_pagination_token,
        prev_pagination_token,
      });
    }
  ),

  /**
   * The mock for Create a Tag.
   * Rejects the request if tag name includes `error` string
   *
   * @returns A default fixtures with provided `name`
   */
  http.post<
    {},
    components['schemas']['TagCreateSchema'],
    TagReadSchema | ErrorResponse
  >(tagsPath, async ({ request }) => {
    const json = await request.json();

    if (json.name.includes('error')) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: json.name,
          },
        },
        {
          status: 403,
        }
      );
    }

    const newTag: TagReadSchema = {
      id: generateRandomId(),
      name: json.name,
      updated_at: generateRandomDate(),
      created_at: generateRandomDate(),
      created_by_entity_user_id: getRandomProperty(entityUsers).id,
    };

    tagsList.push(newTag);

    await delay();

    return HttpResponse.json(newTag);
  }),

  /**
   * The mock for Update a Tag.
   * Rejects the request if tag name includes `error` string
   *
   * @returns A default fixtures with provided `name`
   */
  http.patch<
    { id: string },
    components['schemas']['TagUpdateSchema'],
    TagReadSchema | ErrorResponse
  >(`${tagsPath}/:id`, async ({ request, params }) => {
    const json = await request.json();
    const tagId = params.id;

    if (json.name?.includes('error')) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: json.name,
          },
        },
        {
          status: 403,
        }
      );
    }

    tagsList = tagsList.map((tag) => {
      if (tag.id === tagId) {
        return {
          ...tag,
          name: json.name!,
        };
      }

      return tag;
    });

    const updatedTag = tagsList.find((tag) => tag.id === tagId);

    if (!updatedTag) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: json.name!,
          },
        },
        {
          status: 403,
        }
      );
    }

    await delay();

    return HttpResponse.json(updatedTag);
  }),

  /**
   * Delete tag by `id`
   * If provided `0` as `tagId` parameter then return an error
   *
   * @returns Nothing with 204 status code or error message
   */
  http.delete<TagDeleteRequest, {}>(`${tagsPath}/:id`, async ({ params }) => {
    /** If tag is `0` then we should trigger an error */
    if (params.id === '0') {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Custom error message',
          },
        },
        {
          status: 400,
        }
      );
    }

    tagsList = tagsList.filter((tag) => tag.id !== params.id);

    return new HttpResponse(undefined, { status: 204 });
  }),
];

type TagsPaginationResponse = components['schemas']['TagsPaginationResponse'];
type TagReadSchema = components['schemas']['TagReadSchema'];
