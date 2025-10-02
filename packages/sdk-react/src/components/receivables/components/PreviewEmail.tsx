import { useCreateInvoiceEmailPreview } from '../hooks/useCreateInvoiceEmailPreview';
import { components } from '@/api';
import { LanguageCodeEnum } from '@/enums/LanguageCodeEnum';
import { CenteredContentBox } from '@/ui/box/CenteredContentBox';
import { Button } from '@/ui/components/button';
import { LoadingSpinner } from '@/ui/loading';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircleAlert, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PreviewEmailProps {
  invoiceId: string;
  body: string;
  subject: string;
}

export const PreviewEmail = ({
  invoiceId,
  body,
  subject,
}: PreviewEmailProps) => {
  const { i18n } = useLingui();

  const [attemptNumber, setAttemptNumber] = useState(0);

  const {
    data: preview,
    mutateAsync: createPreview,
    isPending: isCreatingPreview,
    error,
  } = useCreateInvoiceEmailPreview(invoiceId);

  const refresh = () => {
    setAttemptNumber(attemptNumber + 1);
  };

  const isLanguageCodeEnum = (
    value: string
  ): value is components['schemas']['LanguageCodeEnum'] => {
    return Object.values(LanguageCodeEnum).includes(
      value as components['schemas']['LanguageCodeEnum']
    );
  };

  const language = () => {
    const locale = i18n.locale;
    const dashIndex = locale.indexOf('-');
    const languageCode =
      dashIndex >= 0 ? locale.substring(0, dashIndex) : locale;

    if (isLanguageCodeEnum(languageCode)) {
      return languageCode;
    }

    return 'en';
  };

  useEffect(() => {
    createPreview({
      body_text: body,
      subject_text: subject,
      language: language(),
      type: 'receivable',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptNumber]);

  return (
    <div className="mtw:flex mtw:flex-col mtw:min-h-0 mtw:overflow-hidden mtw:flex-1">
      {isCreatingPreview ? (
        <CenteredContentBox>
          <LoadingSpinner />
        </CenteredContentBox>
      ) : (
        <>
          {error ? (
            <CenteredContentBox>
              <div className="mtw:flex mtw:flex-col mtw:items-center mtw:justify-center mtw:gap-4">
                <CircleAlert className="mtw:text-red-500" />
                <div className="mtw:flex mtw:flex-col mtw:justify-center mtw:text-center mtw:gap-1 mtw:items-center">
                  <h2 className="mtw:font-bold mtw:text-base">
                    {t(i18n)`Failed to generate email preview`}
                  </h2>
                  <div className="mtw:items-center">
                    <p className="mtw:text-sm mtw:font-normal mtw:leading-5">
                      {t(i18n)`Please try to reload.`}
                    </p>
                    <p className="mtw:text-sm mtw:font-normal mtw:leading-5">
                      {t(i18n)`If the error recurs, contact support, please.`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={refresh}
                    data-testid="reload-preview-button"
                  >
                    <RefreshCcw />
                    {t(i18n)`Reload`}
                  </Button>
                </div>
              </div>
            </CenteredContentBox>
          ) : (
            <iframe
              srcDoc={preview?.body_preview}
              style={{
                width: '100%',
                height: '100%',
                marginBottom: '-16px', // Margin is necessary to avoid vertical scrollbar on the iframe container element. It's not clear why, but it helps.
                border: 0,
                flex: 1,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
