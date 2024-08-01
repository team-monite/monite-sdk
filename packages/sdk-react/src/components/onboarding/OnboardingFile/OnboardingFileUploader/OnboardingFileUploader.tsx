import React, { ChangeEvent, ReactNode, useCallback } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CloudUpload } from '@mui/icons-material';
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  styled,
  Typography,
} from '@mui/material';

import { OnboardingFileDescription } from '../OnboardingFileDescription';

type OnboardingFileUploaderProps = {
  label: string;
  name: string;
  fileType: components['schemas']['AllowedFileTypes'];
  onChange: (fileId: string) => void;
  error?: ReactNode;
  description?: string[];
};

export const OnboardingFileUploader = ({
  label,
  name,
  fileType,
  error,
  onChange,
  description,
}: OnboardingFileUploaderProps) => {
  const { i18n } = useLingui();

  const { api, queryClient } = useMoniteContext();
  const { mutateAsync, isPending } = api.files.postFiles.useMutation(
    undefined,
    {
      onSuccess: async () => {
        await api.files.getFiles.invalidateQueries(queryClient);
      },
    }
  );

  const handleSubmit = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const selectedFile = event.target.files?.[0];

      if (!selectedFile) return;

      const file = await mutateAsync({
        body: {
          file: selectedFile,
          file_type: fileType,
        },
      });

      onChange(file.id);

      return file;
    },
    [fileType, mutateAsync, onChange]
  );

  return (
    <>
      <StyledUploading id={name} variant={'outlined'}>
        <Typography variant={'h6'}>{label}</Typography>

        <Typography color={'grey'} variant={'body1'}>{t(
          i18n
        )`Upload a document here.`}</Typography>

        <Button
          component="label"
          size="large"
          variant="contained"
          color="primary"
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress color="inherit" size={22} />
            ) : (
              <CloudUpload />
            )
          }
        >
          {isPending && t(i18n)`Processing...`}
          {!isPending && t(i18n)`Choose document`}

          <VisuallyHiddenInput
            accept={'.jpg,.jpeg,.png,.pdf'}
            onChange={handleSubmit}
            type="file"
          />
        </Button>
      </StyledUploading>

      {description && <OnboardingFileDescription descriptions={description} />}

      {error && (
        <Alert severity="error" icon={false}>
          {error}
        </Alert>
      )}
    </>
  );
};

const StyledUploading = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'over',
})<{ over?: boolean }>`
  position: relative;
  padding: ${({ theme }) => theme.spacing(4)};
  border-width: 3px;
  ${({ theme, over }) => over && `border-color: ${theme.palette.primary.main};`}
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
