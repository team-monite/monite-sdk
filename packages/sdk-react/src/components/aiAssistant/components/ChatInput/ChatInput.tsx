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
  isNewChat: boolean;
  onStartConversation: () => void;
}

export const ChatInput: FC<ChatInputProps> = ({
  isNewChat,
  onStartConversation,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [showPrompts, setShowPrompts] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLDivElement | null>(
    null
  );

  const { input, status, setInput, handleSubmit } = useAIAssistantChat();

  const isStreaming = status === 'streaming';
  const isDisabled = !input || isStreaming;

  const handleClearInput = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.innerHTML = '';
    setInput('');

    if (isNewChat) {
      onStartConversation();
    }
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
  };

  const handleClosePrompts = useCallback(() => {
    setShowPrompts(false);
  }, []);

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
      handleClosePrompts();
    }

    if (shouldRemoveInnerHtml) {
      handleClearInput();
      handleClosePrompts();
    }

    const isEnterPressed = e.key === 'Enter' && !e.shiftKey;

    if (!isEnterPressed) {
      return;
    }

    handleInputSubmit(e);
  };

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const content = e.target.textContent ?? '';

    if (content === '/') {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        setShowPrompts(true);
      }
    }

    setInput(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePromptInsert = useCallback((prompt: string) => {
    if (!editorRef.current) {
      return;
    }

    const currentContent = editorRef.current.innerHTML;
    const slashIndex = currentContent.indexOf('/');

    if (slashIndex !== -1) {
      editorRef.current.innerHTML = prompt;

      handleClosePrompts();
      setInput(prompt);

      setCursorAtTheEnd(editorRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = useCallback((text: string) => {
    setInput(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      ref={(node) => {
        setPopoverAnchorEl(node);
      }}
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
          popoverAnchorEl={popoverAnchorEl}
          closePrompts={handleClosePrompts}
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
