import LabelText from '../LabelText';

const Story = {
  title: 'LabelText',
  component: Text,
};

export default Story;

export const DefaultLabelText = () => {
  return <LabelText label={'Label'} text={'Text'} />;
};
