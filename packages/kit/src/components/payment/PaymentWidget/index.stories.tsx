import PaymentWidget from './PaymentWidget';

const Story = {
  title: 'PaymentWidget',
  component: PaymentWidget,
};
export default Story;

export const DefaultTable = () => (
  <>
    <PaymentWidget price={1000} returnUrl="/" fee={10.4} />
  </>
);
