import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const Default = () => (
  <PayableDetails
    id={'242fd40a-1c81-49b4-8578-d6b4a4c89da7'}
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
