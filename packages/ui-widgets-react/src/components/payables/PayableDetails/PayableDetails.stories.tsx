import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'16949fba-033b-4158-8f8f-a97c8d4b968e'}
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
