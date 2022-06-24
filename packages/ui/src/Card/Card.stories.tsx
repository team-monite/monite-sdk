import DetailsCard from './Card';
import Button from '../Button';
import { EditIcon, MailIcon } from '../Icons';
import LabelText from '../LabelText';
import Link from '../Link';

const Story = {
  title: 'Components/Card',
  component: Text,
};

export default Story;

export const DefaultCard = () => {
  return (
    <DetailsCard
      content={
        <>
          <LabelText label={'Company name'} text={'Company name'} />
          <LabelText label={'Type'} text={'Type'} />
          <LabelText label={'Business address'} text={'Business address'} />
        </>
      }
    />
  );
};

export const CardWithActions = () => {
  return (
    <DetailsCard
      content={
        <>
          <LabelText label={'Company name'} text={'Company name'} />
          <LabelText label={'Type'} text={'Type'} />
          <LabelText label={'Business address'} text={'Business address'} />
        </>
      }
      actions={
        <>
          <Button
            color="blue"
            leftIcon={<EditIcon fill={'blue'} width={24} height={24} />}
          >
            Edit details
          </Button>
          <Link
            color="blue"
            href={'#'}
            leftIcon={<MailIcon width={24} height={24} fill={'blue'} />}
          >
            Send email
          </Link>
        </>
      }
    />
  );
};
