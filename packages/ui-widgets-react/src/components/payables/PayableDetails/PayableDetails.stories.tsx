import PayableDetails from './PayableDetails';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
};

export default Story;

export const Default = () => (
  <PayableDetails
    id={'c987a274-e361-46da-a815-eda5f6905caa'}
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
