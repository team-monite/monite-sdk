import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React, {
  type ChangeEvent,
  forwardRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react';

interface AIRichEditorProps {
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLFormElement | HTMLDivElement>) => void;
  handlePaste: (text: string) => void;
}

export const AIRichEditor = forwardRef<HTMLDivElement, AIRichEditorProps>(
  ({ handleInput, handleKeyDown, handlePaste }, editorRef) => {
    const { i18n } = useLingui();

    const onInput = (e: ChangeEvent<HTMLInputElement>) => {
      handleInput(e);
    };

    const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      const clipboardData = e.clipboardData?.getData('text');

      if (!clipboardData) {
        return;
      }

      const selection = window.getSelection();

      if (!selection || !selection.rangeCount) {
        return;
      }

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const textNode = document.createTextNode(clipboardData);
      range.insertNode(textNode);

      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      const updatedText =
        typeof editorRef !== 'function' &&
        editorRef?.current &&
        editorRef.current.innerText;

      if (!updatedText) {
        return;
      }

      handlePaste(updatedText);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLFormElement | HTMLDivElement>) => {
      handleKeyDown(e);
    };

    return (
      <div
        ref={editorRef}
        contentEditable
        data-placeholder={t(i18n)`Ask AI...`}
        onKeyDown={onKeyDown}
        onInput={onInput}
        onPaste={onPaste}
        className={cn(
          'mtw:w-full mtw:min-h-[92px] mtw:max-h-[192px] mtw:grow mtw:overflow-y-auto',
          'mtw:text-sm-normal mtw:[&_*]:!whitespace-break-spaces',
          'mtw:bg-gray-100 mtw:box-content mtw:border-none',
          'mtw:focus-visible:outline-none'
        )}
      />
    );
  }
);
