import React from 'react';

import {
  Title,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import FlexTable from '../FlexTable';
import { Flex, Box } from '../Box';
import Badge from '../Badge';
import Button from '../Button';

const Story = {
  title: 'DesignSystem/Documentation',
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            <div>Status of ui components</div>
          </Subtitle>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

export default Story;

const statuses = {
  Done: 'success',
  'Add to storybook': 'warning',
  'Not ready': 'draft',
};

const data = [
  {
    name: 'Accordion',
    status: 'Done',
  },
  {
    name: 'AccordionItem',
    status: 'Add to storybook',
  },
  {
    name: 'Avatar',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=3102%3A51761',
  },
  {
    name: 'AvatarInput',
    status: 'Add to storybook',
  },
  {
    name: 'Badge',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2163%3A18857',
  },
  {
    name: 'Box',
    status: 'Done',
  },
  {
    name: 'Button',
    status: 'Done',
  },
  {
    name: 'Card',
    status: 'Done',
  },
  {
    name: 'Checkbox',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2158%3A18757',
  },
  {
    name: 'DatePicker',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2163%3A18825',
  },
  {
    name: 'Dropdown',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2163%3A21953',
  },
  {
    name: 'FlexTable',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2163%3A18894',
  },
  {
    name: 'FormField',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2158%3A18735',
  },
  {
    name: 'Icons',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2142%3A25188',
  },
  {
    name: 'Input',
    status: 'Add to storybook',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2158%3A18736',
  },
  {
    name: 'ListItem',
    status: 'Add to storybook',
  },
  {
    name: 'Modal',
    status: 'Done',
  },
  {
    name: 'PasswordInput',
    status: 'Add to storybook',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=4078%3A174004',
  },
  {
    name: 'Radio',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2158%3A18768',
  },
  {
    name: 'Select',
    status: 'Add to storybook',
  },
  {
    name: 'Sidebar',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=3958%3A225525',
  },
  {
    name: 'Spinner',
    status: 'Done',
  },
  {
    name: 'Table',
    status: 'Done',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2163%3A18894',
  },
  {
    name: 'Text',
    status: 'Needs improvement',
    comment: 'Add variants',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2142%3A18342',
  },
  {
    name: 'Tooltip',
    status: 'Add to storybook',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2158%3A18724',
  },
  {
    name: 'Tab',
    status: 'Not ready',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2157%3A18493',
  },
  {
    name: 'Separator',
    status: 'Not ready',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=3866%3A194819',
  },
  {
    name: 'MultiSelectWithBadges',
    status: 'Not ready',
  },
  {
    name: 'Autocomplete',
    status: 'Not ready',
  },
  {
    name: 'Chips',
    status: 'Not ready',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2159%3A18797',
  },
  {
    name: 'Switch',
    status: 'Not ready',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2199%3A25485',
  },
  {
    name: 'Skeleton',
    status: 'Not ready',
    figmaLink:
      'https://www.figma.com/file/oF9hQLqMxoGZAVBn2UR3Ie/WL-06-%7C-Approval-policies-%7C-Use-cases-%7C-21.10.21?node-id=2971%3A105637',
  },
  {
    name: 'BadgeDot',
    status: 'Not ready',
  },
  {
    name: 'Pagination',
    status: 'Not ready',
    comment: 'Need design',
  },
  {
    name: 'Colors',
    status: 'Add to storybook',
    figmaLink:
      'https://www.figma.com/file/sIzcQHjFEhYt47GGKz2zSd/Design-System-2.0?node-id=2142%3A22906',
  },
];

export const StatusOfComponents = () => {
  return (
    <div style={{ height: '100%', width: '100%', padding: 48 }}>
      <FlexTable>
        <Flex>
          <Box width={1}>Name of the component</Box>
          <Box width={1}>Status of development</Box>
          <Box width={1}>Comment</Box>
          <Box width={1}>Link to Figma</Box>
        </Flex>
        {data.map(({ name, status, comment, figmaLink }) => (
          <Flex>
            <Box width={1}>{name}</Box>
            <Box width={1}>
              <Badge text={status} color={statuses[status]} />
            </Box>
            <Box width={1}>{comment}</Box>
            <Box width={1}>
              {figmaLink && (
                <a href={figmaLink} target="_blank" rel="noreferrer">
                  <Button
                    noPadding
                    color="blue"
                    type="Link"
                    text={`${name} in Figma`}
                  />
                </a>
              )}
            </Box>
          </Flex>
        ))}
      </FlexTable>
    </div>
  );
};
