import { ComponentStory } from '@storybook/react';

import Radiobox from '.';

const Story = {
  title: 'Data Input/Radiobox',
  component: Radiobox,
};
export default Story;

const Template: ComponentStory<typeof Radiobox> = (args) => (
  <Radiobox {...args} />
);

export const DefaultRadio = Template.bind({});
DefaultRadio.args = {
  label: 'Default Radio',
};

export const States = () => {
  return (
    <>
      <Radiobox id="1" name="1" value="1" label="Default" />
      <br />
      <Radiobox id="1" name="1" value="1" disabled label="Disabled" />
      <br />
      <Radiobox id="1" name="1" value="1" checked label="Checked" />
      <br />
      <Radiobox
        id="1"
        name="1"
        value="1"
        disabled
        checked
        label="Disabled, Checked"
      />
    </>
  );
};
