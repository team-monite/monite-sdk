import CounterpartsDetails from './CounterpartsDetails';
import { CounterpartType } from '@monite/sdk-api';

const Story = {
  title: 'In Progress/Counterparts — Details',
  component: CounterpartsDetails,
};

export default Story;

export const OrganizationCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails type={CounterpartType.ORGANIZATION} />
  </div>
);

export const IndividualCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails type={CounterpartType.INDIVIDUAL} />
  </div>
);
