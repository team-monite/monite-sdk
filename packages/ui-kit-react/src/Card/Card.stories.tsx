import DetailsCard from './Card';
import Button from '../Button';
import { UEnvelopeAlt, UPen } from '../unicons';
import LabelText from '../LabelText';
import Link from '../Link';
import { Box } from '../Box';

const Story = {
  title: 'Data Display/Card',
  component: Text,
};

export default Story;

export const DefaultCard = () => {
  return (
    <DetailsCard>
      <Box sx={{ padding: '27px 23px 32px' }}>
        <LabelText label={'Company name'} text={'Company name'} />
        <LabelText label={'Type'} text={'Type'} />
        <LabelText label={'Business address'} text={'Business address'} />
      </Box>
    </DetailsCard>
  );
};

export const CardWithShadow = () => {
  return (
    <DetailsCard shadow>
      <Box sx={{ padding: '27px 23px 32px' }}>
        <LabelText label={'Company name'} text={'Company name'} />
        <LabelText label={'Type'} text={'Type'} />
        <LabelText label={'Business address'} text={'Business address'} />
      </Box>
    </DetailsCard>
  );
};

export const CardWithActions = () => {
  return (
    <DetailsCard
      actions={
        <>
          <Button variant={'text'} size={'sm'} leftIcon={<UPen size={20} />}>
            Edit details
          </Button>
          <Link href={'#'} leftIcon={<UEnvelopeAlt width={20} />}>
            Send email
          </Link>
        </>
      }
    >
      <Box sx={{ padding: '27px 23px 32px' }}>
        <LabelText label={'Company name'} text={'Company name'} />
        <LabelText label={'Type'} text={'Type'} />
        <LabelText label={'Business address'} text={'Business address'} />
      </Box>
    </DetailsCard>
  );
};
