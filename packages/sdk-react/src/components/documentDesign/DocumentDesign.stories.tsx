import { css } from '@emotion/react';
import { StoryObj } from "@storybook/react";

import { DocumentDesign as DocumentDesignComponent } from "./DocumentDesign";

const Story = {
    title: 'Document design',
    component: DocumentDesignComponent,
};

type Story = StoryObj<typeof DocumentDesignComponent>;

export const DocumentDesign: Story = {
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
            <DocumentDesignComponent />
        </div>
    ),
};

export default Story;