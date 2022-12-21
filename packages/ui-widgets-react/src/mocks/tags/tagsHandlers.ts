import { rest } from 'msw';

import {
  TAGS_ENDPOINT,
  TagsResponse,
  TagCreateOrUpdateSchema,
  TagReadSchema,
} from '@team-monite/sdk-api';

import { tagListFixture } from './tagsFixture';

const tagsPath = `*/${TAGS_ENDPOINT}`;

export const tagsHandlers = [
  // read tag list
  rest.get<undefined, {}, TagsResponse>(tagsPath, ({ url }, res, ctx) => {
    return res(
      ctx.json({
        data: tagListFixture,
      })
    );
  }),

  // read tag list with limit
  rest.get<undefined, {}, TagsResponse>(
    `${tagsPath}?limit=10`,
    ({ url }, res, ctx) => {
      return res(
        ctx.json({
          data: tagListFixture,
        })
      );
    }
  ),

  // create tag
  rest.post<TagCreateOrUpdateSchema, {}, TagReadSchema>(
    tagsPath,
    ({ params }, res, ctx) => {
      return res(ctx.json(tagListFixture[0]));
    }
  ),
  // create tag error
  // rest.post<TagCreateOrUpdateSchema, {}, ErrorSchema>(
  //   tagsPath,
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.status(400),
  //       ctx.json({
  //         message: 'Error',
  //       })
  //     );
  //   }
  // ),

  // update tag
  rest.patch<TagCreateOrUpdateSchema, {}, TagReadSchema>(
    `${tagsPath}/:id`,
    ({ params }, res, ctx) => {
      return res(ctx.json(tagListFixture[0]));
    }
  ),

  // delete tag
  rest.delete<TagCreateOrUpdateSchema, {}, TagReadSchema>(
    `${tagsPath}/:id`,
    ({ params }, res, ctx) => {
      return res(ctx.status(204));
    }
  ),
];
