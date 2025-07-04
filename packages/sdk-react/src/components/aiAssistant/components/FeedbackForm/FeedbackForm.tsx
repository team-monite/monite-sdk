import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getFeedbackOptions } from '@/components/aiAssistant/consts';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, IconButton, Input } from '@mui/material';

import { X } from 'lucide-react';

interface FeedbackFormProps {
  conversationId: string;
  onSuccess?: () => void;
}

export const FeedbackForm = ({
  conversationId,
  onSuccess,
}: FeedbackFormProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const { mutateAsync: postFeedbackMessage } =
    api.ai.postAiMessageFeedbacksCommentary.useMutation();

  const [input, setInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const feedbackOptions = useMemo(() => getFeedbackOptions(i18n), [i18n]);

  const handleCloseForm = () => {
    onSuccess?.();
  };

  const handleSendFeedbackMessage = async (comment: string) => {
    await postFeedbackMessage({
      body: {
        message_id: conversationId,
        comment,
      },
    });

    setIsSuccess(true);
  };

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await handleSendFeedbackMessage(input);
  };

  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    formRef.current.focus();
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsSuccess(false);
      onSuccess?.();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <div
        className={cn(
          'mtw:p-4 mtw:min-h-[110px] mtw:border mtw:border-solid mtw:border-border mtw:mt-4',
          'mtw:flex mtw:items-center mtw:justify-center mtw:rounded-md'
        )}
      >
        <p className="mtw:text-sm mtw:text-neutral-30">{t(
          i18n
        )`Thank you for your feedback!`}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn(
        'mtw:relative mtw:p-4 mtw:mt-4 mtw:border mtw:border-solid mtw:border-border',
        'mtw:rounded-md mtw:flex mtw:flex-col mtw:gap-4'
      )}
    >
      <IconButton
        onClick={handleCloseForm}
        className={cn(
          'mtw:!absolute mtw:!right-2 mtw:!top-2 mtw:!h-4 mtw:!w-4',
          'mtw:!border-none mtw:!p-0 mtw:hover:!bg-transparent'
        )}
      >
        <X />
      </IconButton>

      <h5 className="mtw:text-sm mtw:font-normal">{t(i18n)`Tell us more`}:</h5>

      <div className="mtw:flex mtw:flex-wrap mtw:gap-2">
        {feedbackOptions.map(({ feedback }) => (
          <Button
            type="button"
            onClick={() => handleSendFeedbackMessage(feedback)}
            key={feedback}
            className={cn(
              'mtw:!px-3 mtw:!py-2.5 mtw:!font-normal mtw:!text-sm mtw:!text-inherit',
              'mtw:border mtw:border-solid mtw:!border-border mtw:!bg-transparent'
            )}
            variant="outlined"
          >
            {feedback}
          </Button>
        ))}
      </div>

      <Input
        value={input}
        onChange={handleInputValue}
        placeholder={t(i18n)`(Optional) Feel free to add specific details`}
        className={cn(
          'mtw:w-full mtw:focus-visible:ring-0 mtw:focus-visible:ring-offset-0',
          'mtw:resize-none mtw:border mtw:border-solid mtw:!border-border',
          'mtw:!rounded-md mtw:px-3.5 mtw:!text-sm'
        )}
        slotProps={{ input: { className: 'mtw:!px-0' } }}
      />
    </form>
  );
};
