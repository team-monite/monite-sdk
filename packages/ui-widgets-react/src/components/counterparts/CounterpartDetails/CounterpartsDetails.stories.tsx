import CounterpartsDetails from './CounterpartsDetails';
import counterparts from '../fixtures/counterparts';

const Story = {
  title: 'In Progress/Counterparts — Details',
  component: CounterpartsDetails,
};

export default Story;

export const OrganizationCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails onEdit={() => {}} counterPart={counterparts[0]} />
  </div>
);

export const IndividualCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails onEdit={() => {}} counterPart={counterparts[1]} />
  </div>
);
