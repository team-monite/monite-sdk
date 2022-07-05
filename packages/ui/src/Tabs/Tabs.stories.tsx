// import { ComponentStory } from '@storybook/react';

import { Tabs, Tab, TabList, TabPanel } from './index';

const Story = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default Story;

// const Template: ComponentStory<typeof Tabs> = ({ children, ...args }) => (
//   <Tabs {...args}>{children}</Tabs>
// );

export const DefaultTabs = () => {
  return (
    <div style={{ background: '#F3F3F3' }}>
      <Tabs>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab>Tab three</Tab>
        </TabList>

        <TabPanel>
          <h2>Any content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 3</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};
