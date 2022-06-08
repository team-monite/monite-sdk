import React from 'react';

import Checkbox from '.';

const Story = {
  title: 'Checkbox',
  component: Checkbox,
};
export default Story;

export const Checkboxes = () => (
  <>
    <Checkbox />
    <br />
    <br />
    <Checkbox disabled />
    <br />
    <br />
    <Checkbox checked />
  </>
);
