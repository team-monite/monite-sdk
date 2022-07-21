import PaymentWidget from './PaymentWidget';

const Story = {
  title: 'PaymentWidget',
  component: PaymentWidget,
};
export default Story;

export const DefaultTable = () => (
  <>
    <PaymentWidget
      id="cc2fa0aa-2199-4f96-a0cd-9edb78ad74d1"
      returnUrl="/"
      fee={350}
    />
  </>
);
