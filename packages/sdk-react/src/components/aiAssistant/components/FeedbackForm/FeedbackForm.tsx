import { type ChangeEvent, type FC, useEffect, useRef, useState } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Input } from '@mui/material';

import { X } from 'lucide-react';

const FEEDBACK_OPTIONS = [
  { feedback: 'This information is not correct' },
  { feedback: 'Didn’t follow prompt input' },
];

interface FeedbackFormProps {
  id: string;
  setIsFeedbackFormOpen: (isFeedbackFormOpen: boolean) => void;
}

export const FeedbackForm: FC<FeedbackFormProps> = ({
  id,
  setIsFeedbackFormOpen,
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { i18n } = useLingui();

  const { api } = useMoniteContext();
  const { mutateAsync: postFeedbackMessage } =
    api.ai.postFeedbackMessage.useMutation();

  const [input, setInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCloseForm = () => {
    setIsFeedbackFormOpen(false);
  };

  const handleSendFeedbackMessage = async (comment: string) => {
    await postFeedbackMessage({
      body: {
        message_id: id,
        comment,
      },
    });

    setIsSuccess(true);
  };

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    handleSendFeedbackMessage(input);
  };

  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    formRef.current.focus();
    formRef.current.scrollTo();
  }, []);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    setTimeout(() => {
      setIsSuccess(false);
      setIsFeedbackFormOpen(false);
    }, 2000);
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
      method="post"
      action="/assistant/post-feedback-details"
      onSubmit={handleSubmit}
      className={cn(
        'mtw:relative mtw:p-4  mtw:mt-4 mtw:border mtw:border-solid mtw:border-border',
        'mtw:rounded-md mtw:flex mtw:flex-col mtw:gap-4'
      )}
    >
      <Button
        type="button"
        onClick={handleCloseForm}
        className={cn(
          'mtw:absolute mtw:right-2 mtw:top-2 mtw:h-4 mtw:w-4',
          'mtw:border-none mtw:p-0 mtw:hover:bg-transparent'
        )}
        variant="outlined"
      >
        <X />
      </Button>

      <h5 className="mtw:text-sm">{t(i18n)`Tell us more`}:</h5>

      <div className="mtw:flex mtw:flex-wrap mtw:gap-2 mtw:text-sm">
        {FEEDBACK_OPTIONS.map(({ feedback }) => (
          <Button
            type="button"
            onClick={() => handleSendFeedbackMessage(feedback)}
            key={feedback}
            className="mtw:p-3 mtw:font-normal"
            variant="outlined"
          >
            {t(i18n)`${feedback}`}
          </Button>
        ))}
      </div>

      <Input
        value={input}
        onChange={handleInputValue}
        placeholder={t(i18n)`(Optional) Feel free to add specific details`}
        className={cn(
          'mtw:w-full mtw:focus-visible:ring-0 mtw:focus-visible:ring-offset-0 mtw:focus-visible:outline-none',
          'mtw:resize-none mtw:border mtw:border-solid mtw:border-border',
          'mtw:rounded-md mtw:py-2.5 mtw:px-3.5 mtw:text-sm'
        )}
      />
    </form>
  );
};
