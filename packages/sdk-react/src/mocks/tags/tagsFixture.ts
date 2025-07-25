import { components } from '@/api';
import { tagCategories } from '@/components/tags/helpers';
import {
  entityUser2,
  entityUser3,
  entityUser4,
  entityUser5,
  entityUser6,
  entityUserByIdFixture,
} from '@/mocks/entityUsers/entityUserByIdFixture';
import { getRandomNumber } from '@/utils/storybook-utils';

export const tagListFixture: components['schemas']['TagReadSchema'][] = [
  {
    id: 'tag-1',
    name: 'tag 1',
    created_at: '2022-09-07T16:35:18.484507+00:00',
    updated_at: '2023-10-10T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUserByIdFixture.id,
  },
  {
    id: 'tag-2',
    name: 'Extremely long tag name which should be cutted',
    created_at: '2022-09-06T16:35:18.484507+00:00',
    updated_at: '2023-10-11T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser3.id,
  },
  {
    id: 'tag-3',
    name: 'tag 3',
    created_at: '2022-09-05T16:35:18.484507+00:00',
    updated_at: '2023-10-12T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser2.id,
  },
  {
    id: 'tag-4',
    name: 'tag 4',
    created_at: '2022-09-01T16:35:18.484507+00:00',
    updated_at: '2023-10-22T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser3.id,
  },
  {
    id: 'tag-5',
    name: 'tag 5',
    created_at: '2022-09-03T16:35:18.484507+00:00',
    updated_at: '2023-10-06T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser4.id,
  },
  {
    id: 'tag-6',
    name: 'tag 6',
    created_at: '2022-09-04T16:35:18.484507+00:00',
    updated_at: '2023-10-10T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser4.id,
  },
  {
    id: 'tag-7',
    name: 'tag 7',
    created_at: '2022-09-01T16:35:18.484507+00:00',
    updated_at: '2023-10-25T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser5.id,
  },
  {
    id: 'tag-8',
    name: 'tag 8',
    created_at: '2022-09-01T16:35:18.484507+00:00',
    updated_at: '2023-10-22T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser2.id,
  },
  {
    id: 'tag-9',
    name: 'tag 9',
    created_at: '2022-09-03T16:35:18.484507+00:00',
    updated_at: '2023-10-06T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser6.id,
  },
  {
    id: 'tag-10',
    name: 'tag 10',
    created_at: '2022-09-04T16:35:18.484507+00:00',
    updated_at: '2023-10-10T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser3.id,
  },
  {
    id: 'tag-11',
    name: 'tag 11',
    created_at: '2022-11-01T16:35:18.484507+00:00',
    updated_at: '2023-12-25T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUser5.id,
  },
  {
    id: 'tag-12',
    name: 'tag 12',
    created_at: '2022-10-11T16:35:18.484507+00:00',
    updated_at: '2023-11-21T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUserByIdFixture.id,
  },
  {
    id: 'tag-13',
    name: 'tag 13',
    created_at: '2022-10-11T16:35:18.484507+00:00',
    updated_at: '2023-11-21T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUserByIdFixture.id,
  },
  {
    id: 'tag-14',
    name: 'tag 14',
    created_at: '2022-10-11T16:35:18.484507+00:00',
    updated_at: '2023-11-21T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUserByIdFixture.id,
  },
  {
    id: 'tag-15',
    name: 'tag 15',
    created_at: '2022-10-11T16:35:18.484507+00:00',
    updated_at: '2023-11-21T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUserByIdFixture.id,
  },
  {
    id: 'tag-16',
    name: 'tag 16',
    created_at: '2022-10-11T16:35:18.484507+00:00',
    updated_at: '2023-11-21T16:35:18.484507+00:00',
    created_by_entity_user_id: entityUserByIdFixture.id,
  },
].map((tag) => ({
  ...tag,
  category: tagCategories[
    getRandomNumber(0, tagCategories.length - 1)
  ] as components['schemas']['TagCategory'],
}));
