import React from 'react';

import {
  Title,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import { Flex, Box } from '../Box';
import Text from '../Text';
import { THEMES } from 'consts';

const Story = {
  title: 'DesignSystem/Colors',
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            <div>Design System theme</div>
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

const Block = ({
  color,
  name,
  hex,
  style,
}: {
  color: string;
  name: string;
  hex?: string;
  style?: any;
}) => (
  <Flex flexDirection="column">
    <Box
      bg={color}
      width={110}
      height={80}
      borderRadius={8}
      m={'0 16px 8px 0'}
      style={style}
    />
    <Text>{name}</Text>
    <Text color="grey" textSize="small">
      {hex}
    </Text>
  </Flex>
);

export const Colors = () => {
  const { colors } = THEMES.default;
  return (
    <div style={{ height: '100%', width: '100%', padding: '0 48px 48px 48px' }}>
      <Text textSize="h4" m={'16px 0'}>
        Primary palette
      </Text>
      <Flex>
        <Block color={colors.primary} name="Default" hex="#246fff" />
        <Block color={colors.primaryDarker} name="Darker" hex="#1D59CC" />
        <Block color={colors.primaryLighter} name="Lighter" hex="#5790FF" />
        <Block
          color={colors.primaryLightest}
          name=" Lightest"
          hex="Default (#246FFF), alpha 10%"
        />
      </Flex>

      <Text textSize="h4" m={'32px 0 16px 0'}>
        Danger palette
      </Text>
      <Flex>
        <Block color={colors.danger} name="Default" hex="#FF475D" />
        <Block color={colors.dangerDarker} name="Darker" hex="#CC394B" />
        <Block color={colors.dangerLighter} name="Lighter" hex="#FF7A8A" />
      </Flex>

      <Text textSize="h4" m={'32px 0 16px 0'}>
        Success palette
      </Text>
      <Flex>
        <Block color={colors.success} name="Default" hex="#1FBCA0" />
        <Block color={colors.successDarker} name="Darker" hex="#0DAA8E" />
        <Block color={colors.successLighter} name="Lighter" hex="#4DD6BE" />
      </Flex>

      <Text textSize="h4" m={'32px 0 16px 0'}>
        Warning palette
      </Text>
      <Flex>
        <Block color={colors.warning} name="Default" hex="#F9A03F" />
        <Block color={colors.warningDarker} name="Darker" hex="#C78032" />
        <Block color={colors.warningLighter} name="Lighter" hex="#FFBC73" />
      </Flex>

      <Flex m={'32px 0 16px 0'}>
        <Block color={colors.black} name="Black" hex="#111111" />
        <Block color={colors.darkGrey} name="Dark Grey" hex="#3B3B3B" />
        <Block color={colors.grey} name="Grey" hex="#707070" />
        <Block color={colors.lightGrey1} name="Light Grey 1" hex="#B8B8B8" />
        <Block color={colors.lightGrey2} name="Light Grey 2" hex="#DDDDDD" />
        <Block color={colors.lightGrey3} name="Light Grey 3" hex="#F3F3F3" />
        <Block
          color={colors.white}
          name="White"
          hex="#FFFFFF"
          style={{ border: '1px solid #DDDDDD' }}
        />
      </Flex>

      <Flex m={'32px 0 16px 0'}>
        <Block color={colors.blue} name="Blue" hex="#246FFF" />
        <Block color={colors.navy} name="Navy" hex="#062766" />
      </Flex>

      <Flex m={'32px 0 16px 0'}>
        <Block color={colors.lime} name="Lime" hex="#CDFB7D" />
        <Block color={colors.teal} name="Teal" hex="#00A9B9" />
        <Block color={colors.purple} name="Purple" hex="#7A1A83" />
        <Block color={colors.lime} name="Lime" hex="#CDFB7D" />
      </Flex>

      <Flex m={'32px 0 16px 0'}>
        <Block color={colors.lavender} name="Lavender" hex="#CDC1FF" />
        <Block color={colors.orange} name="Orange" hex="#F9A03F" />
        <Block color={colors.pink} name="Pink" hex="#FA78AF" />
        <Block color={colors.red} name="Red" hex="#FF475D" />
      </Flex>

      <Flex m={'32px 0 16px 0'}>
        <Block color={colors.tagPink} name="Tag Pink" hex="#FBF1FC" />
        <Block color={colors.tagViolet} name="Tag Violet" hex="#A06DC8" />
        <Block color={colors.tagBeige} name="Tag Beige" hex="#FFF3E9" />
        <Block color={colors.tagOrange} name="Tag Orange" hex="#E27E46" />
        <Block color={colors.tagSalad} name="Tag Salad" hex="#E1FBEB" />
        <Block color={colors.tagGreen} name="Tag Green" hex="#1FBCA0" />
      </Flex>
    </div>
  );
};
