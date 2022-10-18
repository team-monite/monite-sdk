import { Box } from '@team-monite/ui-kit-react';

import YapilyWidget from './YapilyWidget';

const Story = {
  title: 'Payments/YapilyWidget',
  component: YapilyWidget,
};

export default Story;

export const Default = () => (
  <Box sx={{ width: 635 }}>
    <YapilyWidget />
  </Box>
);
