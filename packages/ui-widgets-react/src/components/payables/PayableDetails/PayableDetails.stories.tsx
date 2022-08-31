import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'6ec831c9-1265-4ce5-898b-731755bd8309'}
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
