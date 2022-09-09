import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'741d9876-4198-4c7d-80d7-4dca874bb4ea'}
    onClose={() => {
      console.log('onClose');
    }}
    onSave={() => {
      console.log('onSave');
    }}
    onSubmit={() => {
      console.log('onSubmit');
    }}
    onReject={() => {
      console.log('onReject');
    }}
    onApprove={() => {
      console.log('onApprove');
    }}
    onPay={() => {
      console.log('onPay');
    }}
  />
);
