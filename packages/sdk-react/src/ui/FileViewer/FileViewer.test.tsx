import { FileViewer } from '@/ui/FileViewer/FileViewer';
import { renderWithClient } from '@/utils/test-utils';
import { screen } from '@testing-library/react';

describe('FileViewer', () => {
  test('renders image tag when mime type is an image', () => {
    renderWithClient(
      <FileViewer url="test.jpg" mimetype="image/jpeg" name="test" />
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg');
  });

  test('renders iframe when mime type is an pdf', () => {
    renderWithClient(
      <FileViewer url="test.pdf" mimetype="application/pdf" name="test" />
    );
  });
});
