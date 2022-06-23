import React from 'react';

import FlexTable from '.';
import { Flex, Box } from '../Box';

const Story = {
  title: 'Components/FlexTable',
  component: FlexTable,
};
export default Story;

export const DefaultFlexTable = () => (
  <div style={{ maxWidth: 400 }}>
    <FlexTable>
      <Flex>
        <Box width={1}>Cell1</Box>
        <Box width={1}>Cell2</Box>
        <Box width={1}>Cell3</Box>
      </Flex>
      <Flex>
        <Box width={1}>Cell4</Box>
        <Box width={1}>Cell5</Box>
        <Box width={1}>Cell6</Box>
      </Flex>
      <Flex>
        <Box width={1}>Cell7</Box>
        <Box width={1}>Cell8</Box>
        <Box width={1}>Cell9</Box>
      </Flex>
    </FlexTable>
  </div>
);
