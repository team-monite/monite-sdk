import Avatar from '.';

import {
  Title,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';

const Stoys = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>Custom Avatar</Subtitle>
          <br />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

export default Stoys;

export const DefaultAvatar = () => <Avatar size={34}>Avatar</Avatar>;

export const Avatars = () => (
  <>
    <Subtitle>With image</Subtitle>
    <Avatar
      size={34}
      src="https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png"
    />
    <br />
    <br />
    <Subtitle>Disabled</Subtitle>
    <Avatar
      disabled
      size={34}
      src="https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png"
    />
    <br />
    <br />
    <Subtitle>With children</Subtitle>
    <Avatar size={34}>Monite</Avatar>
    <br />
    <br />
    <Subtitle>With custom color</Subtitle>
    <Avatar size={34} color={'orange'}>
      Monite
    </Avatar>
    <br />
    <br />
    <Subtitle>With status</Subtitle>
    <Avatar withStatus size={34} color={'orange'}>
      Monite
    </Avatar>
  </>
);
