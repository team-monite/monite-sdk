import LabelText from '../LabelText';

const Story = {
  title: 'Data Display/LabelText',
  component: Text,
};

export default Story;

export const DefaultLabelText = () => {
  return <LabelText label={'Label'} text={'Text'} />;
};
