import CounterpartsDetails from './CounterpartsDetails';
import { CounterpartType } from '@monite/sdk-api';

const Story = {
  title: 'In Progress/Counterparts — Details',
  component: CounterpartsDetails,
};

export default Story;

export const OrganizationCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails
      id={'1b10a11e-c021-4d14-8b06-fb94f0c9ea91'}
      type={CounterpartType.ORGANIZATION}
    />
  </div>
);

export const IndividualCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails
      // id={'6c81b7b8-82ad-432e-ae39-44b7de4e4fef'}
      type={CounterpartType.INDIVIDUAL}
    />
  </div>
);
