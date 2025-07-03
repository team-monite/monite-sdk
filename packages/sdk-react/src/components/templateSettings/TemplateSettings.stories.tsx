import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { TemplateSettings as TemplateSettingsComponent } from './TemplateSettings';

const Story = {
  title: 'Template settings/Template settings',
  component: TemplateSettingsComponent,
};

type Story = StoryObj<typeof TemplateSettingsComponent>;

export const TemplateSettings: Story = {
  args: {},
  render: () => (
    <div
      css={css`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
      `}
    >
      <TemplateSettingsComponent />
    </div>
  ),
};

export default Story;
