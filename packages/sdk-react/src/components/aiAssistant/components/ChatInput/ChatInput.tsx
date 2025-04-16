import React, {
  type ChangeEvent,
  FC,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { PromptsPopover } from '@/components/aiAssistant/components/PromptsPopover/PromptsPopover';
import { cn } from '@/ui/lib/utils';

import { SendHorizontal } from 'lucide-react';

import { useAIAssistantChat } from '../../context/AIAssistantChatContext';
import { setCursorAtTheEnd } from '../../utils/aiAssistant';
import { AIRichEditor } from '../AIRichEditor/AIRichEditor';

interface ChatInputProps {
  onStartConversation?: (conversationId: string) => void;
}

export const ChatInput: FC<ChatInputProps> = ({ onStartConversation }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [showPrompts, setShowPrompts] = useState(false);

  const { id, input, status, setInput, handleSubmit } = useAIAssistantChat();

  const isStreaming = status === 'streaming';
  const isDisabled = !input || isStreaming;

  const handleClearInput = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.innerHTML = '';
    setInput('');
  };

  const handleInputSubmit = (
    e:
      | FormEvent<HTMLFormElement>
      | KeyboardEvent<HTMLFormElement | HTMLDivElement>
  ) => {
    if (!editorRef.current) {
      return;
    }

    handleSubmit(e);
    handleClearInput();

    onStartConversation?.(id);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLFormElement | HTMLDivElement>
  ) => {
    const shouldRemoveInnerHtml =
      (e.key === 'Backspace' || e.key === 'Delete') &&
      editorRef &&
      editorRef.current &&
      editorRef.current.textContent &&
      (editorRef.current.textContent.split('').length === 1 ||
        window.getSelection()?.toString().length ===
          editorRef.current.textContent.split('').length);

    if (e.key === 'Escape') {
      setShowPrompts(false);
    }

    if (shouldRemoveInnerHtml) {
      handleClearInput();
      setShowPrompts(false);
    }

    const isEnterPressed = e.key === 'Enter' && !e.shiftKey;

    if (!isEnterPressed) {
      return;
    }

    handleInputSubmit(e);
  };

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const content = e.target.innerHTML;

    if (content === '/') {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        setShowPrompts(true);
      }
    }

    setInput(content);
  }, []);

  const handlePromptInsert = useCallback((prompt: string) => {
    if (!editorRef.current) {
      return;
    }

    const currentContent = editorRef.current.innerHTML;
    const slashIndex = currentContent.indexOf('/');

    if (slashIndex !== -1) {
      editorRef.current.innerHTML = prompt;

      setShowPrompts(false);
      setInput(prompt);

      setCursorAtTheEnd(editorRef.current);
    }
  }, []);

  const handlePaste = useCallback((text: string) => {
    setInput(text);
  }, []);

  useEffect(() => {
    const isFocused = document.activeElement === editorRef.current;

    if (!editorRef.current || isFocused) {
      return;
    }

    editorRef.current.innerHTML = input;
    editorRef.current.focus();
    setCursorAtTheEnd(editorRef.current);
  }, [input]);

  return (
    <div
      className={cn(
        'mtw:2xl:max-w-4xl mtw:lg:max-w-2xl mtw:md:max-w-lg mtw:sm:max-w-md mtw:max-w-xs mtw:mt-auto',
        'mtw:w-full mtw:mx-auto mtw:flex mtw:flex-col mtw:gap-2 mtw:sticky mtw:bottom-0 mtw:pb-15 mtw:bg-background'
      )}
    >
      <form
        className={cn(
          'mtw:flex mtw:items-center mtw:gap-2 mtw:rounded-xl mtw:px-5 mtw:py-4 mtw:w-full',
          'mtw:border mtw:border-transparent mtw:border-solid mtw:bg-primary-85',
          'mtw:hover:border-primary-50 mtw:relative'
        )}
        onSubmit={handleInputSubmit}
      >
        <AIRichEditor
          ref={editorRef}
          handleInput={handleInput}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
        />

        <PromptsPopover
          editorRef={editorRef}
          showPrompts={showPrompts}
          onPromptInsert={handlePromptInsert}
        />

        <button
          className={cn(
            isDisabled ? 'mtw:cursor-default' : 'mtw:cursor-pointer'
          )}
          disabled={isDisabled}
          type="submit"
        >
          <SendHorizontal
            className={cn(isDisabled && 'mtw:text-gray-200')}
            size={17}
          />
        </button>
      </form>
    </div>
  );
};
