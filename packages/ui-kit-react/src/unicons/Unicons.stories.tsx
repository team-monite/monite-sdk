import { Primary, Title } from '@storybook/addon-docs';
import Link from '../Link';

const Story = {
  title: 'DesignSystem/Unicons',
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Primary />
        </>
      ),
    },
  },
};

export default Story;

export const Unicons = () => {
  return (
    <Link
      textSize={'h3'}
      target={'_blank'}
      href={'https://iconscout.com/unicons/explore/line'}
    >
      Link to unicons
    </Link>
  );
};
