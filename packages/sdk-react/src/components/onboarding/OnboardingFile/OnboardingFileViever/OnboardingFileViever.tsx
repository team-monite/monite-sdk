import { OnboardingFileDescription } from '@/components/onboarding/OnboardingFile/OnboardingFileDescription';
import { useFileById } from '@/core/queries';
import { OcrFileType } from '@/core/types/filetypes';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

type OnboardingFileViewerProps = {
  label: string;
  name: string;
  value: string;
  onChange: (fileId: string) => void;
  error?: ReactNode;
  description?: string[];
};

export const OnboardingFileViewer = ({
  label,
  description,
  value,
  onChange,
  error,
  name,
}: OnboardingFileViewerProps) => {
  const { i18n } = useLingui();
  const { data } = useFileById(value);

  const isPDF = data?.mimetype === OcrFileType.PDF;

  return (
    <>
      <Typography textAlign="center" variant={'h6'}>
        {label}
      </Typography>

      {!isPDF && data?.url && (
        <a target="_blank" rel="noopener noreferrer" href={data.url}>
          <img
            css={{ width: '100%' }}
            alt={'test'}
            loading="lazy"
            src={data.url}
          />
        </a>
      )}

      {isPDF && (
        <iframe
          loading="lazy"
          css={{ border: 'none' }}
          src={data?.url}
          width="100%"
          height="350"
        />
      )}

      {description && <OnboardingFileDescription descriptions={description} />}

      {error && (
        <Alert severity="error" icon={false}>
          {error}
        </Alert>
      )}

      <Button
        id={name}
        onClick={() => onChange('')}
        size="large"
        variant="contained"
        color="primary"
      >{t(i18n)`Try another document`}</Button>
    </>
  );
};
