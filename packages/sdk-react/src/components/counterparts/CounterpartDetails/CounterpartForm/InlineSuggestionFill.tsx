import { Button } from '@/ui/components/button';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface InlineSuggestionFillProps {
  rawData: string | undefined;
  isHidden: boolean;
  fieldOnChange: (value: string) => void;
}

export const InlineSuggestionFill = ({
  rawData,
  isHidden,
  fieldOnChange,
}: InlineSuggestionFillProps) => {
  const { i18n } = useLingui();

  if (rawData && !isHidden) {
    return (
      <span className="mtw:text-sm mtw:text-muted-foreground">
        {t(i18n)`Update to match bill: `}
        <Button
          variant="link"
          size="sm"
          className="mtw:ml-0.5 mtw:p-0 mtw:h-auto mtw:font-medium mtw:underline"
          onClick={(event) => {
            event.preventDefault();
            fieldOnChange(rawData);
          }}
        >
          {rawData}
        </Button>
      </span>
    );
  }

  return null;
};
