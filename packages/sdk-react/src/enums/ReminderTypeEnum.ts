import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['ReminderTypeEnum']]: key;
} = {
  term_1: 'term_1',
  term_2: 'term_2',
  term_final: 'term_final',
  overdue: 'overdue',
};

export const ReminderTypeEnum = Object.values(schema);
