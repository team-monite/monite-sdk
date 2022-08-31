import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'df3fbebd-552f-46e5-9d5e-1f7a6df1add9'}
    debug={false}
    onClose={() => {
      console.log('onClose');
    }}
    onPay={() => {
      console.log('onPay');
    }}
    onReject={() => {
      console.log('onReject');
    }}
    onSubmit={() => {
      console.log('onSubmit');
    }}
    onApprove={() => {
      console.log('onApprove');
    }}
    onSave={() => {
      console.log('onSave');
    }}
  />
);
