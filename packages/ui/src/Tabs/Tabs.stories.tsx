import { Tabs, Tab, TabList, TabPanel } from './index';
import { Box } from '../Box';
import {
  ArgsTable,
  Primary,
  PRIMARY_STORY,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs';
import Link from '../Link';

const Story = {
  title: 'Data Display/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            <>
              This component uses a third party library{' '}
              <Link
                target="_blank"
                textSize={'h3'}
                href={'https://github.com/reactjs/react-tabs'}
              >
                react-tabs
              </Link>
            </>
          </Subtitle>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

export default Story;

export const DefaultTabs = () => {
  return (
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
  );
};

export const TabsWithCounter = () => {
  return (
    <Tabs>
      <TabList>
        <Tab count={2}>Document</Tab>
        <Tab count={3}>Tab two</Tab>
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
  );
};

export const ScrollableTabs = () => {
  return (
    <Box sx={{ width: 300 }}>
      <Tabs>
        <TabList scrollable>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab>Tab three</Tab>
          <Tab>Tab four</Tab>
          <Tab>Tab five</Tab>
          <Tab>Tab six</Tab>
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
        <TabPanel>
          <h2>Any content 4</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 5</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 6</h2>
        </TabPanel>
      </Tabs>
    </Box>
  );
};
