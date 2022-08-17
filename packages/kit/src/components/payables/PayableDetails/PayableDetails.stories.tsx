import PayableDetails from './PayableDetails';
import { Box } from '@monite/ui';

const Story = {
  title: 'Payable Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <Box sx={{ width: '100%' }}>
    <PayableDetails
      id={'test'}
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
  </Box>
);
