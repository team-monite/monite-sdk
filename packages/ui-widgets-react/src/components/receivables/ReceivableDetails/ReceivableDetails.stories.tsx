import withMock from 'storybook-addon-mock';
import ReceivableDetails from './ReceivableDetails';
import { receivableByIdFixture } from 'mocks/receivables';

const Story = {
  title: 'Receivables/Receivables — Details',
  component: ReceivableDetails,
  decorators: [withMock],
  parameters: {
    mockData: [
      {
        url: 'https://api.dev.monite.com/v1/receivables/1b2fe86b-f02a-4f3f-a258-a19e53bd06ec',
        method: 'GET',
        status: 200,
        response: receivableByIdFixture,
      },
    ],
  },
};

export default Story;

export const Default = () => (
  <div style={{ maxWidth: 600 }}>
    <ReceivableDetails
      id={'1b2fe86b-f02a-4f3f-a258-a19e53bd06ec'}
      onClose={() => {
        console.log('onClose');
      }}
    />
  </div>
);
