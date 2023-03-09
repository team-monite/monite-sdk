import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithClient } from 'utils/test-utils';
import TagFormModal from './TagFormModal';
import i18n from '../../../core/i18n';

function generateRandomText(customMessage?: string) {
  return (Math.random() + 1)
    .toString(36)
    .substring(7)
    .concat(customMessage ?? '');
}

describe('TagFormModal', () => {
  describe('# Create new Tag', () => {
    test('should NOT create tag if the fild is empty', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(<TagFormModal onCreate={onCreateMock} />);

      const createButton = screen.getByRole('button', {
        name: i18n.t('common:create'),
      });

      expect(createButton).toBeInTheDocument();

      expect(onCreateMock).not.toHaveBeenCalled();
      fireEvent.click(createButton);

      /**
       * We will see a text only on next render loop,
       *  because of that we have to use `findByText`
       *  which is asyncronous
       */
      const error = await screen.findByText(/is a required field/);

      /**
       * We still should have no trigger on `onCreateMock`
       *  because the form must be invalid because it's empty
       */
      expect(onCreateMock).not.toHaveBeenCalled();

      expect(error).toBeInTheDocument();
    });

    test('should create tag with submit form', async () => {
      const onCreateMock = jest.fn();
      const onCloseMock = jest.fn();

      renderWithClient(
        <TagFormModal onCreate={onCreateMock} onClose={onCloseMock} />
      );

      const form = screen.getByRole('form');

      expect(form).toBeInTheDocument();

      expect(onCreateMock).not.toHaveBeenCalled();

      const text = generateRandomText();
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: text },
      });
      fireEvent.submit(form);

      /** Wait until we see tooltip that the tag has been created */
      await screen.findByText(new RegExp(text));

      expect(onCreateMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('should create tag with filled tag name', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(<TagFormModal onCreate={onCreateMock} />);

      const createButton = screen.getByRole('button', {
        name: i18n.t('common:create'),
      });

      expect(createButton).toBeInTheDocument();

      expect(onCreateMock).not.toHaveBeenCalled();

      const text = generateRandomText();
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: text },
      });
      fireEvent.click(createButton);

      /** Wait until we see tooltip that the tag has been created */
      await screen.findByText(new RegExp(text));

      expect(onCreateMock).toHaveBeenCalledTimes(1);
    });

    test('should toast an error if the backend reject the request with no callback calls', async () => {
      const onCreateMock = jest.fn();
      const onCloseMock = jest.fn();

      renderWithClient(
        <TagFormModal onCreate={onCreateMock} onClose={onCloseMock} />
      );

      const createButton = screen.getByRole('button', {
        name: i18n.t('common:create'),
      });

      expect(createButton).toBeInTheDocument();

      expect(onCreateMock).not.toHaveBeenCalled();

      const text = generateRandomText(' error');
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: text },
      });
      fireEvent.click(createButton);

      /** We expect a custom error if the user passes `error` as a text */
      await screen.findByText(new RegExp(text));

      /** onCreate nor onClock shouldn't be called */
      expect(onCreateMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  describe('# Update existing Tag', () => {
    test('should update the tag with new tag title', async () => {
      const onUpdateMock = jest.fn();
      const onCloseMock = jest.fn();

      renderWithClient(
        <TagFormModal
          tag={{
            id: 'tag-1',
            name: 'Tag name',
          }}
          onCreate={onUpdateMock}
          onClose={onCloseMock}
        />
      );

      const updateButton = screen.getByRole('button', {
        name: i18n.t('common:save'),
      });

      expect(updateButton).toBeInTheDocument();
      expect(onUpdateMock).not.toHaveBeenCalled();

      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: '[UPDATED] Tag name' },
      });
      fireEvent.click(updateButton);

      /** Wait until we see tooltip that the tag has been updated */
      await screen.findByText(/\[UPDATED\] Tag name/);

      expect(onUpdateMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('should update the tag with new tag title while form submitted', async () => {
      const onUpdateMock = jest.fn();
      const onCloseMock = jest.fn();

      renderWithClient(
        <TagFormModal
          tag={{
            id: 'tag-1',
            name: 'Tag name',
          }}
          onCreate={onUpdateMock}
          onClose={onCloseMock}
        />
      );

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      expect(onUpdateMock).not.toHaveBeenCalled();

      const text = generateRandomText();
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: text },
      });
      fireEvent.submit(form);

      /** Wait until we see tooltip that the tag has been updated */
      await screen.findByText(new RegExp(text));

      expect(onUpdateMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('should NOT update title and toast an error if the backend rejects update', async () => {
      const onUpdateMock = jest.fn();
      const onCloseMock = jest.fn();

      renderWithClient(
        <TagFormModal
          tag={{
            id: 'tag-1',
            name: 'Tag name',
          }}
          onCreate={onUpdateMock}
          onClose={onCloseMock}
        />
      );

      const updateButton = screen.getByRole('button', {
        name: i18n.t('common:save'),
      });

      expect(updateButton).toBeInTheDocument();
      expect(onUpdateMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();

      const errorText = generateRandomText(' error');
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: errorText },
      });
      fireEvent.click(updateButton);

      await screen.findByText(new RegExp(errorText));

      expect(onUpdateMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });
});
