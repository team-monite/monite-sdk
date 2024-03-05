import React from 'react';

import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { screen } from '@testing-library/react';

import { Tags } from './Tags';

describe('Tags', () => {
  test('renders Tags with create tag button', async () => {
    renderWithClient(<Tags />);

    await waitUntilTableIsLoaded();

    const createTagButton = screen.getByRole('button', {
      name: t`Create new tag`,
    });

    expect(createTagButton).toBeInTheDocument();
    expect(createTagButton.attributes.getNamedItem('disabled')).toBeNull();
  });
});
