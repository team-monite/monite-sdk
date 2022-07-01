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
          <Subtitle>
            <div>
              <span>Custom Avatar</span>
              <br />
            </div>
          </Subtitle>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

export default Stoys;

export const DefaultAvatar = () => <Avatar size={34} name="Monite" />;

export const Avatars = () => (
  <>
    <Avatar
      size={34}
      url="https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png"
      name="Monite"
    />
    <br />
    <Avatar size={34} name="Monite" textSize="h1" />
  </>
);
