import { render, screen } from '@testing-library/react';

import React from 'react';

import Tag from '../Tag';

it("SHOULD render badge's text", () => {
  render(<Tag>Contact us</Tag>);
  expect(screen.getByText('Contact us')).toBeInTheDocument();
});
