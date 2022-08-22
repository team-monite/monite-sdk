import PayableDetails from './PayableDetails';
import { Box, Modal } from '@monite/ui';

const Story = {
  title: 'Payable Details',
  component: PayableDetails,
};

export default Story;

export const DefaultForm = () => (
  <Box sx={{ width: '100%' }}>
    <Modal>
      <PayableDetails
        id={'d8915b79-0228-45ca-9a66-5a201db9c6a7'}
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
    </Modal>
  </Box>
);
