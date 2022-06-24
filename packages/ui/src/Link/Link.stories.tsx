import { ComponentStory } from '@storybook/react';

import Link from './Link';

import { InfoIcon, MailIcon } from '../Icons';

const Story = {
  title: 'Components/Link',
  component: Link,
};

export default Story;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const DefaultLink = Template.bind({});
DefaultLink.args = {
  children: 'Default Link',
};

export const PrimaryLink = () => {
  return (
    <>
      <Link href={'#'}>Danger</Link>{' '}
      <Link href={'#'} disabled>
        Danger
      </Link>{' '}
      <Link href={'#'}>
        <InfoIcon />
      </Link>{' '}
      <Link href={'#'} leftIcon={<MailIcon width={24} height={24} />}>
        Primary
      </Link>
    </>
  );
};
//
// export const Secondary = () => {
//   return (
//     <>
//       <Link color="secondary">Secondary</Link>{' '}
//       <Link color="secondary" disabled>
//         Secondary
//       </Link>{' '}
//       <Link color="secondary" isLoading />{' '}
//       <Link color="secondary" icon={<InfoIcon />} />{' '}
//       <Link color="secondary" leftIcon={<InfoIcon width={24} height={24} />}>
//         Secondary
//       </Link>
//     </>
//   );
// };
//
// export const Danger = () => {
//   return (
//     <>
//       <Link color="danger">Danger</Link>{' '}
//       <Link color="danger" disabled>
//         Danger
//       </Link>{' '}
//       <Link color="danger" isLoading />{' '}
//       <Link color="danger" icon={<InfoIcon />} />{' '}
//       <Link color="danger" leftIcon={<InfoIcon width={24} height={24} />}>
//         Danger
//       </Link>
//     </>
//   );
// };
//
// export const BlockLink = () => {
//   return (
//     <Box width={[1, 1 / 2]} pt={2}>
//       <Link block my={1}>
//         Block
//       </Link>
//       <Link block isLoading my={1} />
//     </Box>
//   );
// };
//
// export const ColoredLinks = () => {
//   return (
//     <>
//       <Link color="blue">Blue</Link>{' '}
//       <Link color="grey" disabled>
//         Grey
//       </Link>{' '}
//       <Link color="salad" isLoading />{' '}
//       <Link color="orange" icon={<InfoIcon width={24} height={24} />} />{' '}
//       <Link color="green" leftIcon={<InfoIcon width={24} height={24} />}>
//         Green
//       </Link>
//     </>
//   );
// };
//
// export const LinksWithNoPadding = () => {
//   return (
//     <>
//       <Link noPadding color="blue">
//         Blue
//       </Link>{' '}
//       <Link noPadding color="grey" disabled>
//         Grey
//       </Link>{' '}
//       <Link noPadding color="salad" isLoading />{' '}
//       <Link
//         noPadding
//         color="orange"
//         icon={<InfoIcon width={24} height={24} />}
//       />{' '}
//       <Link
//         noPadding
//         color="green"
//         leftIcon={<InfoIcon width={24} height={24} />}
//       >
//         Green
//       </Link>
//     </>
//   );
// };
