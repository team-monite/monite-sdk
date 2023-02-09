import PaymentDetails from './PaymentDetails';
import { paymentIntent } from '../../../mocks/payment';

const Story = {
  title: 'Payments/Payment — Details',
  component: PaymentDetails,
};

export default Story;

export const Default = () => (
  <div style={{ width: 635 }}>
    <PaymentDetails paymentIntent={paymentIntent} />
  </div>
);
