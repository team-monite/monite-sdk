import { components } from '@/api';

const schema: {
  [key in components['schemas']['ProcessStatusEnum']]: key;
} = {
  succeeded: 'succeeded',
  waiting: 'waiting',
  failed: 'failed',
  running: 'running',
  canceled: 'canceled',
  timed_out: 'timed_out',
};

export const ProcessStatusEnum = Object.values(schema);
