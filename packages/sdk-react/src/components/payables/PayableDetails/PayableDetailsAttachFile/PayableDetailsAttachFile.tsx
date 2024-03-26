import React, { useState, useMemo, DragEvent } from 'react';
import { toast } from 'react-hot-toast';

import { useAttachFileToPayable } from '@/core/queries/usePayable';
import { CenteredContentBox } from '@/ui/box';
import { SUPPORTED_MIME_TYPES } from '@/ui/FileViewer';
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
import { styled } from '@mui/material/styles';

const maxFileSizeInMB = 10;
const maxFileSizeInKB = 1024 * 1024 * maxFileSizeInMB;

type PayableDetailsAttachFileProps = {
  payableId: string;
};

const VisuallyHiddenFileInput = styled('input')({
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const PayableDetailsAttachFile = ({
  payableId,
}: PayableDetailsAttachFileProps) => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const [dragIsOver, setDragIsOver] = useState(false);
  const { mutate: attachFileToPayable, isPending: isLoading } =
    useAttachFileToPayable(payableId);
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

    const droppedFiles = Array.from(event.dataTransfer.files);

    processFile(droppedFiles[0]);
  };

  const handleButtonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);

      processFile(uploadedFiles[0]);
    }
  };

  const processFile = (file?: File) => {
    if (!file) {
      toast.error(t(i18n)`No file provided`);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        toast.error(t(i18n)`Unsupported file type`);
        return;
      }

      if (file.size > maxFileSizeInKB) {
        toast.error(t(i18n)`File size exceeds ${maxFileSizeInMB}MB limit.`);
        return;
      }

      payableId &&
        attachFileToPayable(
          {
            file,
          },
          {
            onSuccess: () => {
              toast.success(t(i18n)`File successfully attached`);
            },
          }
        );
    };

    reader.onerror = () => {
      console.error(t(i18n)`There was an issue reading the file.`);
    };

    reader.readAsDataURL(file);
  };

  return isLoading ? (
    <CenteredContentBox>
      <CircularProgress />
    </CenteredContentBox>
  ) : (
    <Box
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
            <Button variant="outlined" component="label">
              {t(i18n)`Choose from device`}
              <VisuallyHiddenFileInput
                type="file"
                accept="application/pdf,image/*"
                multiple={false}
                onChange={handleButtonUpload}
              />
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
