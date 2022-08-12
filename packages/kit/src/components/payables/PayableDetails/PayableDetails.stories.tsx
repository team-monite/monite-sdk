import PayableDetails from './PayableDetails';
import payables from '../fixtures/list';
import counterparts from '../../counterparts/fixtures/counterparts';
import { TagReadSchema } from '@monite/js-sdk';
import { Box } from '@monite/ui';

const Story = {
  title: 'Payable Details',
  component: PayableDetails,
};

export default Story;

const tags: TagReadSchema[] = [
  {
    id: 'test1',
    name: 'test 1',
  },
  {
    id: 'test2',
    name: 'test 2',
  },
];

export const DefaultForm = () => (
  <Box sx={{ width: '100%' }}>
    <PayableDetails
      isLoading={false}
      tags={tags}
      counterparts={counterparts}
      payable={payables[0]}
      onClose={() => {
        console.log('close');
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
      onPay={(values) => {
        console.log(values);
      }}
      onSave={(values) => {
        console.log(values);
      }}
    />
  </Box>
);

// const tabs = ['document', 'payment', 'status', 'history'];

// <Tabs>
//   <TabList>
//     {tabs.map((tab) => (
//       <Tab key={tab}>{t(`payables:tabs.${tab}`)}</Tab>
//     ))}
//   </TabList>
//   {tabs.map((tab) => (
//     <TabPanel key={tab}></TabPanel>
//   ))}
// </Tabs>
