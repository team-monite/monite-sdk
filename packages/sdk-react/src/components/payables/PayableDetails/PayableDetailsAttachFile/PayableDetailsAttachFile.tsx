import { useState, useMemo, DragEvent } from 'react';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useFileInput } from '@/core/hooks';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { CenteredContentBox } from '@/ui/box';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import {
  Box,
  Button,
  Typography,
  alpha,
  useTheme,
  CircularProgress,
} from '@mui/material';

type PayableDetailsAttachFileProps = {
  payableId: string;
};

export const PayableDetailsAttachFile = ({
  payableId,
}: PayableDetailsAttachFileProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const theme = useTheme();

  const { FileInput, openFileInput, checkFileError } = useFileInput();

  const [dragIsOver, setDragIsOver] = useState(false);

  const attachFileMutation = api.payables.postPayablesIdAttachFile.useMutation(
    {
      path: { payable_id: payableId },
    },
    {
      onSuccess: () =>
        Promise.all([
          api.payables.getPayables.invalidateQueries(queryClient),
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payableId } } },
            queryClient
          ),
        ]),
    }
  );

  const dragOverStyle = useMemo(
    () => ({
      border: 2,
      borderRadius: 2,
      borderStyle: 'dashed',
      borderColor: 'primary.main',
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }),
    [theme.palette.primary.main]
  );

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);

    const droppedFile = Array.from(event.dataTransfer.files)[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const handleFileUpload = (file: File) => {
    const error = checkFileError(file);
    if (error) {
      toast.error(error);
      return;
    }

    payableId &&
      attachFileMutation.mutate(
        {
          file,
        },
        {
          onSuccess: () => {
            toast.success(t(i18n)`File successfully attached`);
          },
          onError: (error) => {
            toast.error(getAPIErrorMessage(i18n, error));
          },
        }
      );
  };

  return attachFileMutation.isPending ? (
    <CenteredContentBox>
      <CircularProgress />
    </CenteredContentBox>
  ) : (
    <Box
      className="Monite-PayableDetailsAttachFile"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        ...(dragIsOver && dragOverStyle),
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box
        sx={{
          margin: 'auto',
        }}
      >
        {dragIsOver ? (
          <>
            <CloudUploadOutlinedIcon color="primary" fontSize="large" />
            <Typography color="primary" variant="subtitle2">{t(
              i18n
            )`Drop the file here to upload`}</Typography>
          </>
        ) : (
          <>
            <AttachFileIcon
              color="primary"
              fontSize="large"
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="h3" sx={{ marginBottom: 1 }}>{t(
              i18n
            )`Attach a file`}</Typography>
            <Typography color="secondary">{t(
              i18n
            )`This invoice doesn't have a file attached.`}</Typography>
            <Typography color="secondary" sx={{ marginBottom: 2 }}>
              {t(
                i18n
              )`Drag & Drop it here to save for administrative purposes.`}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              onClick={openFileInput}
            >
              {t(i18n)`Choose from device`}
            </Button>
            <FileInput
              onChange={(event) => {
                const file = event.target.files ? event.target.files[0] : null;
                if (file) handleFileUpload(file);
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};
