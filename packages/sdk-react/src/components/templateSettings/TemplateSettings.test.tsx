// import { documentTemplateList } from '@/mocks/documentTemplates';
import { renderWithClient } from '@/utils/test-utils';
// import { requestFn } from '@openapi-qraft/react';
import { screen } from '@testing-library/react';

import { TemplateSettings } from './TemplateSettings';

// const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

global.URL.createObjectURL = jest.fn();

describe.skip('TemplateSettings', () => {
  test('should render template settings page', () => {
    renderWithClient(<TemplateSettings />);

    expect(screen.getByText('Layout and logo')).toBeInTheDocument();
    expect(screen.getByText('Other settings')).toBeInTheDocument();
  });

  test('should navigate through tab and display the content properly', () => {
    renderWithClient(<TemplateSettings />);

    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  // describe('when user clicks "select template"', () => {
  //   test('it should show template selection modal', async () => {
  //     renderWithClient(<TemplateSettings />);

  //     const selectTemplateButton = await screen.findByRole('button', {
  //       name: 'Select template',
  //     });
  //     expect(screen.getAllByText('Document design').length).toBe(1);

  //     fireEvent.click(selectTemplateButton);

  //     expect(screen.getAllByText('Document design').length).toBe(2);
  //     expect(
  //       screen.getByRole('button', { name: 'Set as default' })
  //     ).toBeDisabled();

  //     await waitFor(() => {
  //       expect(screen.getByText('Document templates')).toBeInTheDocument();
  //     });

  //     documentTemplateList.data.forEach((template) => {
  //       expect(
  //         screen.getByTestId(`documentTemplate-${template.name}`)
  //       ).toBeInTheDocument();
  //     });

  //     const defaultTemplate = documentTemplateList.data.find(
  //       (template) => template.is_default
  //     );

  //     expect(
  //       within(
  //         screen.getByTestId(`documentTemplate-${defaultTemplate?.name}`)
  //       ).getByText('Default')
  //     ).toBeInTheDocument();
  //   });

  //   describe('when use selects a new template', () => {
  //     test('it enables `Set as default` button', async () => {
  //       renderWithClient(<TemplateSettings />);

  //       const selectTemplateButton = await screen.findByRole('button', {
  //         name: 'Select template',
  //       });

  //       fireEvent.click(selectTemplateButton);

  //       await waitFor(() => {
  //         expect(screen.getByText('Document templates')).toBeInTheDocument();
  //       });

  //       const notDefaultTemplate = documentTemplateList.data.find(
  //         (template) => !template.is_default
  //       );

  //       fireEvent.click(
  //         screen.getByTestId(`documentTemplate-${notDefaultTemplate?.name}`)
  //       );

  //       const setAsDefaultButton = screen.getByRole('button', {
  //         name: 'Set as default',
  //       });

  //       expect(setAsDefaultButton).toBeEnabled();

  //       fireEvent.click(setAsDefaultButton);

  //       await waitFor(() =>
  //         expect(requestFnMock.mock.lastCall?.[0].url).toBe(
  //           '/document_templates/{document_template_id}/make_default'
  //         )
  //       );

  //       await waitFor(() => expect(setAsDefaultButton).toBeDisabled());
  //     });
  //   });

  //   describe('when user clicks "close" button', () => {
  //     test('it should hide selection modal', async () => {
  //       renderWithClient(<TemplateSettings />);

  //       const selectTemplateButton = await screen.findByRole('button', {
  //         name: 'Select template',
  //       });

  //       fireEvent.click(selectTemplateButton);

  //       const closeButton = await screen.findByRole('button', {
  //         name: 'Close document design selection',
  //       });

  //       fireEvent.click(closeButton);

  //       expect(screen.getAllByText('Document design')[1]).not.toBeVisible();
  //       expect(
  //         screen.getByRole('button', { name: 'Set as default' })
  //       ).not.toBeVisible();
  //       expect(screen.getByText('Document templates')).not.toBeVisible();
  //     });
  //   });
  // });
});
