import React from 'react';

import Text from '.';

const Story = {
  title: 'Text',
  component: Text,
};
export default Story;

export const DefaultText = () => (
  <div style={{ maxWidth: 800 }}>
    <Text>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </Text>
  </div>
);

export const Sizes = () => (
  <div style={{ maxWidth: 800 }}>
    <Text size="h2">
      H2: Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s, when an unknown printer took a galley of type and
      scrambled it to make a type specimen book.
    </Text>
    <br />
    <Text size="h3">
      H3: Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s, when an unknown printer took a galley of type and
      scrambled it to make a type specimen book.
    </Text>
    <br />
    <Text size="smallBold">
      smallBold: Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s, when an unknown printer took a galley of type
      and scrambled it to make a type specimen book.
    </Text>
    <br />
    <Text size="smallBoldLink">
      smallBoldLink: Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s, when an unknown printer took a galley of type
      and scrambled it to make a type specimen book.
    </Text>
    <br />
    <Text size="small">
      small: Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s, when an unknown printer took a galley of type and
      scrambled it to make a type specimen book.
    </Text>
    <br />
    <Text size="bold">
      bold: Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s, when an unknown printer took a galley of type and
      scrambled it to make a type specimen book.
    </Text>
    <br />
    <Text>
      Regular: Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s, when an unknown printer took a galley of type and
      scrambled it to make a type specimen book.
    </Text>
  </div>
);
