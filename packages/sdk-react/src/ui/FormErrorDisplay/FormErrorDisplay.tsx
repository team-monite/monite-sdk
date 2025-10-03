import { Alert } from '@/ui/components/alert';
import { AlertCircle } from 'lucide-react';
import { useMemo, memo } from 'react';

export type ErrorDisplayProps = {
  generalError?: string | null;
  fieldErrors: {
    [key: string]: string | null | undefined;
  };
};

export const FormErrorDisplay = memo(
  ({ generalError, fieldErrors }: ErrorDisplayProps) => {
    const hasFieldErrors = useMemo(() => {
      for (const error of Object.values(fieldErrors)) {
        if (error) return true;
      }
      return false;
    }, [fieldErrors]);

    const hasErrors = useMemo(
      () => Boolean(generalError) || hasFieldErrors,
      [generalError, hasFieldErrors]
    );

    if (!hasErrors) return null;

    return (
      <Alert
        variant="error"
        icon={<AlertCircle className="mtw:h-5 mtw:w-5" />}
        className="mtw:mb-4"
      >
        {generalError && (
          <div className="mtw:text-sm mtw:font-medium">{generalError}</div>
        )}

        {hasFieldErrors && (
          <ul
            className={`mtw:list-disc mtw:list-inside mtw:space-y-1 mtw:text-sm ${generalError ? 'mtw:mt-2' : ''}`}
          >
            {Object.entries(fieldErrors).map(([key, error]) =>
              error ? (
                <li key={key} className="mtw:text-sm">
                  {error}
                </li>
              ) : null
            )}
          </ul>
        )}
      </Alert>
    );
  }
);
