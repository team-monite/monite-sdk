import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'29a9d7ed-6b99-4796-a29f-34bdb9782429'}
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
