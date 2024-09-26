import { components } from '@/api';
import { faker } from '@faker-js/faker';

export const mailboxesFixture: components['schemas']['MailboxDataResponse'] = {
  data: [
    {
      id: faker.string.uuid(),
      mailbox_domain_id: faker.string.uuid(),
      mailbox_full_address: faker.internet.email(),
      mailbox_name: faker.company.name(),
      related_object_type: 'payable',
      status: 'active',
    },
    {
      id: faker.string.uuid(),
      mailbox_domain_id: faker.string.uuid(),
      mailbox_full_address: faker.internet.email(),
      mailbox_name: faker.company.name(),
      related_object_type: 'payable',
      status: 'active',
    },
    {
      id: faker.string.uuid(),
      mailbox_domain_id: faker.string.uuid(),
      mailbox_full_address: faker.internet.email(),
      mailbox_name: faker.company.name(),
      related_object_type: 'payable',
      status: 'active',
    },
  ],
};
