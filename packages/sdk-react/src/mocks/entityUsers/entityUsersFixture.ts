import { FileNames } from '../files';
import {
  ALLOWED_FOR_OWN_ROLE_ID,
  FULL_PERMISSION_ROLE_ID,
} from '../roles/rolesFixtures';

export const entityUsersFixture = {
  data: [
    {
      id: '5b4daced-6b9a-4707-83c6-08193d999fab',
      role_id: FULL_PERMISSION_ROLE_ID,
      userpic_file_id: FileNames.file_bird,
      info: {
        email: null,
        phone: null,
      },
      login: 'monite_entity_user_login_083020221631434735',
      first_name: 'Ivan',
      last_name: 'Ivanov',
      status: 'active',
      created_at: '2022-08-30T13:31:43.971531+00:00',
      updated_at: '2023-01-11T18:11:12.340654+00:00',
    },
    {
      id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f3',
      role: null,
      userpic_file_id: FileNames.file_snake,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220151258832',
      first_name: 'John',
      last_name: 'Doe',
      status: 'active',
      created_at: '2022-11-22T21:51:26.154787+00:00',
      updated_at: '2022-11-22T21:51:26.154804+00:00',
    },
    {
      id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f4',
      role: null,
      userpic_file_id: FileNames.file_dog,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154153339',
      first_name: 'Jane',
      last_name: 'Smith',
      status: 'active',
      created_at: '2022-11-22T21:54:15.913683+00:00',
      updated_at: '2022-11-22T21:54:15.913695+00:00',
    },
    {
      id: 'e7646f0e-b5d6-4dc1-a4b0-ceea3b3add68',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154164476',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:17.061866+00:00',
      updated_at: '2022-11-22T21:54:17.061875+00:00',
    },
    {
      id: 'd5df774a-1ca7-403f-ae31-75d7f6fc564f',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154177560',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:18.296763+00:00',
      updated_at: '2022-11-22T21:54:18.296777+00:00',
    },
    {
      id: '590384b8-3254-4e78-bc9d-bc6924dba2ad',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154195145',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:19.430158+00:00',
      updated_at: '2022-11-22T21:54:19.430180+00:00',
    },
    {
      id: 'b32bbd04-72ba-43a5-b893-acd95cb10ea2',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231906527391',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:06:52.942680+00:00',
      updated_at: '2023-01-10T15:06:52.942687+00:00',
    },
    {
      id: '0d06a2eb-da4d-4a82-b2e9-632f4384b24a',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231906568081',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:06:56.606098+00:00',
      updated_at: '2023-01-10T15:06:56.606108+00:00',
    },
    {
      id: 'b3fffb36-659e-43c2-a914-01ecd4bfea1f',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_01102023190657687',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:06:57.571139+00:00',
      updated_at: '2023-01-10T15:06:57.571147+00:00',
    },
    {
      id: 'd49e6c0b-914e-4c39-b6f2-dc2b7ecc8f19',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231906584730',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:06:58.551467+00:00',
      updated_at: '2023-01-10T15:06:58.551477+00:00',
    },
    {
      id: 'd092bd69-0e14-4bf5-8018-462866b765f1',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_01102023190659986',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:06:59.461979+00:00',
      updated_at: '2023-01-10T15:06:59.461991+00:00',
    },
    {
      id: '5395e758-673d-48b6-a9b7-366161467680',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231907038985',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:07:04.192252+00:00',
      updated_at: '2023-01-10T15:07:04.192266+00:00',
    },
    {
      id: 'cc5ef1fd-661a-4ab6-a457-540c1b65a206',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_01102023191807344',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:08.079997+00:00',
      updated_at: '2023-01-10T15:18:08.080006+00:00',
    },
    {
      id: 'b1df205d-4c8a-4516-8edf-8af2c54eb34d',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231918114807',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:11.752996+00:00',
      updated_at: '2023-01-10T15:18:11.753005+00:00',
    },
    {
      id: '44bf50a9-eab7-49ed-95ba-b3754ae8c839',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231918123820',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:12.730788+00:00',
      updated_at: '2023-01-10T15:18:12.730795+00:00',
    },
    {
      id: 'cf9902ce-7148-4957-b6fb-dbfabe53a360',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_01102023191813549',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:13.677136+00:00',
      updated_at: '2023-01-10T15:18:13.677145+00:00',
    },
    {
      id: '3f96f049-e9ca-43de-a216-dc9961bdd86e',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231918146202',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:14.695851+00:00',
      updated_at: '2023-01-10T15:18:14.695860+00:00',
    },
    {
      id: 'abca781c-61b2-4592-9bd5-6a62ddfccf63',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231918183242',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:19.131325+00:00',
      updated_at: '2023-01-10T15:18:19.131341+00:00',
    },
    {
      id: 'fde57bd6-8d4b-4db3-bc36-5822b30bc5ea',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943128695',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:13.176040+00:00',
      updated_at: '2023-01-10T15:43:13.176052+00:00',
    },
    {
      id: '123687d9-56df-4a2a-b2d0-3db1e67c223f',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943168139',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:16.849459+00:00',
      updated_at: '2023-01-10T15:43:16.849468+00:00',
    },
    {
      id: '768c04bf-45c5-4769-af31-e02cffc6ba54',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943173932',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:17.810148+00:00',
      updated_at: '2023-01-10T15:43:17.810158+00:00',
    },
    {
      id: '6b12b719-f1b5-42df-af94-99c893db8fc3',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943188136',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:18.791251+00:00',
      updated_at: '2023-01-10T15:43:18.791259+00:00',
    },
    {
      id: 'a7499425-7beb-44c2-ad39-f984afbe1907',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943196167',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:19.821227+00:00',
      updated_at: '2023-01-10T15:43:19.821237+00:00',
    },
    {
      id: 'e9790438-6107-485d-bf41-741e42519f3f',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943241319',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:24.429467+00:00',
      updated_at: '2023-01-10T15:43:24.429483+00:00',
    },
    {
      id: '0babd613-92b3-4fe9-a0cd-ed195184f3b8',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944425282',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:42.478475+00:00',
      updated_at: '2023-01-10T15:44:42.478487+00:00',
    },
    {
      id: 'e5dbc372-689a-4165-a206-b630933c6e9f',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944458365',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:46.231693+00:00',
      updated_at: '2023-01-10T15:44:46.231704+00:00',
    },
    {
      id: 'aa50f111-09b6-443f-877b-8e5ec9287d70',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944461405',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:47.148414+00:00',
      updated_at: '2023-01-10T15:44:47.148423+00:00',
    },
    {
      id: 'dd9ffeea-0199-4250-a62e-4b7c65cb61a8',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944478006',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:48.138374+00:00',
      updated_at: '2023-01-10T15:44:48.138382+00:00',
    },
    {
      id: '36a7f661-2688-4662-8f35-fc2b879e936e',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944485202',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:49.121406+00:00',
      updated_at: '2023-01-10T15:44:49.121416+00:00',
    },
    {
      id: 'ae21961d-379b-4801-891f-484c7c253543',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944537737',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:54.191400+00:00',
      updated_at: '2023-01-10T15:44:54.191418+00:00',
    },
    {
      id: '57c5f86a-9a6f-4168-8c75-eef20722d332',
      role_id: ALLOWED_FOR_OWN_ROLE_ID,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231947143912',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:47:14.311998+00:00',
      updated_at: '2023-01-10T15:47:14.312006+00:00',
    },
    {
      id: '89774817-19a6-47bd-be15-368b9d9f2b2e',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231947173960',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:47:17.243485+00:00',
      updated_at: '2023-01-10T15:47:17.243499+00:00',
    },
    {
      id: '200475c0-b019-4002-9710-a683beff958e',
      role: null,
      userpic_file_id: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231947171005',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:47:17.884898+00:00',
      updated_at: '2023-01-10T15:47:17.884914+00:00',
    },
  ],
  prev_pagination_token: null,
  next_pagination_token: null,
};
