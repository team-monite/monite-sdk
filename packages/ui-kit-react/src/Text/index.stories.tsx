import Text from '.';
import FlexTable from '../FlexTable';
import { Flex, Box } from '../Box';
import { tokenizedTheme } from '../index';

const Story = {
  title: 'Data Display/Text',
  component: Text,
};

export default Story;

export const DefaultText = () => (
  <div style={{ maxWidth: 800 }}>
    <Text>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </Text>
  </div>
);

export const Sizes = () => (
  <div style={{ maxWidth: 800 }}>
    <FlexTable>
      <Flex>
        <Box width={'25%'}>Text variant</Box>
        <Box width={1}>Example</Box>
      </Flex>
      {Object.keys(tokenizedTheme.typographyStyles).map((textVariant) => (
        <Flex key={textVariant}>
          <Box width={'25%'}>
            <Text textSize={textVariant}>{textVariant}</Text>
          </Box>
          <Box width={1}>
            <Text textSize={textVariant}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text>
          </Box>
        </Flex>
      ))}
    </FlexTable>
  </div>
);
