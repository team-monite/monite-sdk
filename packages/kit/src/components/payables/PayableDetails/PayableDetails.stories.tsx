import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payable Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <PayableDetails
    id={'d8915b79-0228-45ca-9a66-5a201db9c6a7'}
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
