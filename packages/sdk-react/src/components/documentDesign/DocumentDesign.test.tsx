import { documentTemplateList } from '@/mocks/documentTemplates';
import { renderWithClient } from '@/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { DocumentDesign } from './DocumentDesign';

fdescribe('DocumentDesign', () => {
  test('should render document design page', () => {
    renderWithClient(<DocumentDesign />);

    expect(screen.getByText('Document design')).toBeInTheDocument();
    expect(screen.getByText('Select template')).toBeInTheDocument();
  });

  describe('when user clicks "select template"', () => {
    test('it should show template selection modal', async () => {
      renderWithClient(<DocumentDesign />);

      const selectTemplateButton = await screen.findByRole('button', {
        name: 'Select template',
      });
      expect(screen.getAllByText('Document design').length).toBe(1);

      fireEvent.click(selectTemplateButton);

      expect(screen.getAllByText('Document design').length).toBe(2);
      expect(
        screen.getByRole('button', { name: 'Set as default' })
      ).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('Document templates')).toBeInTheDocument();
      });

      documentTemplateList.data.forEach((template) => {
        expect(screen.getAllByText(template.name)[0]).toBeInTheDocument();
      });
    });

    describe('when user clicks "close" button', () => {
      test('it should hide selection modal', async () => {
        renderWithClient(<DocumentDesign />);

        const selectTemplateButton = await screen.findByRole('button', {
          name: 'Select template',
        });

        fireEvent.click(selectTemplateButton);

        const closeButton = await screen.findByRole('button', {
          name: 'Close document design selection',
        });

        fireEvent.click(closeButton);

        expect(screen.getAllByText('Document design')[1]).not.toBeVisible();
        expect(
          screen.getByRole('button', { name: 'Set as default' })
        ).not.toBeVisible();
        expect(screen.getByText('Document templates')).not.toBeVisible();
      });
    });
  });
});
