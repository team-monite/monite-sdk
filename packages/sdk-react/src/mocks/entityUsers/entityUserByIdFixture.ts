import { components } from '@/api';

import { FileNames } from '../files';
import {
  ABSENT_PERMISSION_ROLE_ID,
  ALLOWED_FOR_OWN_ROLE_ID,
  EMPTY_PERMISSION_ROLE_ID,
  FULL_PERMISSION_ROLE_ID,
  LOW_PERMISSION_ROLE_ID,
  READ_ONLY_ROLE_ID,
} from '../roles/rolesFixtures';

export const entityUserByIdFixture: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  role_id: FULL_PERMISSION_ROLE_ID,
  email: undefined,
  phone: undefined,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Ivan',
  last_name: 'Ivanov',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
  userpic_file_id: FileNames.file_snake,
};

export const entityUser2: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f3',
  role_id: FULL_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_dog,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'John',
  last_name: 'Doe',
  status: 'deleted',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUser3: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f4',
  role_id: FULL_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_avatar,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Jane',
  last_name: 'Smith',
  status: 'deleted',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUser4: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f6',
  role_id: FULL_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_avatar2,
  login: 'monite_entity_user_login_083020221631434736',
  first_name: 'Michael',
  last_name: 'Johnson',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUser5: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f7',
  role_id: FULL_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_avatar3,
  login: 'monite_entity_user_login_083020221631434736',
  first_name: 'Emily',
  last_name: 'Williams',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUser6: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f8',
  role_id: FULL_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_bird,
  login: 'monite_entity_user_login_083020221631434736',
  first_name: 'David',
  last_name: 'Brown',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUsers: Record<string, EntityUserResponse> = {
  [entityUser6.id]: entityUser6,
  [entityUser5.id]: entityUser5,
  [entityUser4.id]: entityUser4,
  [entityUser3.id]: entityUser3,
  [entityUser2.id]: entityUser2,
  [entityUserByIdFixture.id]: entityUserByIdFixture,
};

export const entityUserByIdWithLowPermissionsFixture: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  role_id: LOW_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_snake,
  email: undefined,
  phone: undefined,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Low',
  last_name: 'Permissions',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};
export const entityUserByIdWithReadonlyPermissionsFixture: EntityUserResponse =
  {
    id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
    role_id: READ_ONLY_ROLE_ID,
    userpic_file_id: FileNames.file_snake,
    email: undefined,
    phone: undefined,
    login: 'monite_entity_user_login_083020221631434735',
    first_name: 'Low',
    last_name: 'Permissions',
    status: 'active',
    created_at: '2022-08-30T13:31:43.971531+00:00',
    updated_at: '2023-01-11T18:11:12.340654+00:00',
  };

export const entityUserByIdWithOwnerPermissionsFixture: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  role_id: ALLOWED_FOR_OWN_ROLE_ID,
  userpic_file_id: FileNames.file_snake,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Low',
  last_name: 'Permissions',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUserByIdWithEmptyPermissionsFixture: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  role_id: EMPTY_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_snake,
  email: undefined,
  phone: undefined,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Low',
  last_name: 'Permissions',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

export const entityUserByIdWithAbsentPermissionsFixture: EntityUserResponse = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  role_id: ABSENT_PERMISSION_ROLE_ID,
  userpic_file_id: FileNames.file_snake,
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Low',
  last_name: 'Permissions',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};

type EntityUserResponse = components['schemas']['EntityUserResponse'];
