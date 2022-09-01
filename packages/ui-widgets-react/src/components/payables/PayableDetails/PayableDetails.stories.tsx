import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'6ed11873-a850-4876-bc59-895e79fe72e0'}
    debug={true}
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
