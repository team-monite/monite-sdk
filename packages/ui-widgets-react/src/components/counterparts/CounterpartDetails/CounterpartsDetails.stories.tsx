import CounterpartsDetails from './CounterpartsDetails';
import { CounterpartType } from '@team-monite/sdk-api';

const Story = {
  title: 'Counterparts/Counterparts — Details',
  component: CounterpartsDetails,
};

export default Story;

export const OrganizationCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails
      id={'b8784fb4-1b33-433f-aa6d-57e137e9d34f'}
      type={CounterpartType.ORGANIZATION}
    />
  </div>
);

export const IndividualCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails
      id={'72b00f64-b9ed-4c59-ab58-2c19c01a21a7'}
      type={CounterpartType.INDIVIDUAL}
    />
  </div>
);
