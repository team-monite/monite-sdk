import React from 'react';

import Accordion from '.';

const Story = {
  title: 'Accordion',
  component: Accordion,
};
export default Story;

export const DefaultAccordion = () => (
  <Accordion
    items={[
      {
        title: 'Item1',
        content: (
          <>
            Content1
            <br />
            Content1
          </>
        ),
      },
      {
        title: 'Item2',
        content: (
          <>
            Content2
            <br />
            Content2
          </>
        ),
      },
      {
        title: 'Item3',
        content: 'Content3',
      },
    ]}
  />
);

export const DefaultExpandedAccordion = () => (
  <Accordion
    defaultExpandedIndex={1}
    items={[
      {
        title: 'Item1',
        content: (
          <>
            Content1
            <br />
            Content1
          </>
        ),
      },
      {
        title: 'Item2',
        content: (
          <>
            Content2
            <br />
            Content2
          </>
        ),
      },
      {
        title: 'Item3',
        content: 'Content3',
      },
    ]}
  />
);
