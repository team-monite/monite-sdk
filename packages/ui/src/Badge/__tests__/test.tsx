import { render, screen } from '@testing-library/react';

import React from 'react';

import Badge from '../index';

it("SHOULD render badge's text", () => {
  render(<Badge text="Contact us" />);
  expect(screen.getByText('Contact us')).toBeInTheDocument();
});
