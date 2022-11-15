import withMock from 'storybook-addon-mock';
import PayableDetails from './PayableDetails';
import data from '../fixtures/getById';

const Story = {
  title: 'Payables/Payables — Details',
  component: PayableDetails,
  decorators: [withMock],
  parameters: {
    mockData: [
      {
        url: 'https://api.dev.monite.com/v1/payables/242fd40a-1c81-49b4-8578-d6b4a4c89da7',
        method: 'GET',
        status: 200,
        response: data,
      },
      {
        url: 'https://api.dev.monite.com/v1/payables/242fd40a-1c81-49b4-8578-d6b4a4c89da7/pay',
        method: 'POST',
        status: 200,
        response: data,
      },
    ],
  },
};

export default Story;

export const Default = () => (
  <PayableDetails
    id={'242fd40a-1c81-49b4-8578-d6b4a4c89da7'}
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
