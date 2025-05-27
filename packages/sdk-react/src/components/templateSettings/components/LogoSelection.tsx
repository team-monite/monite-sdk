import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useFileInput } from '@/core/hooks';
import { useMyEntity } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Upload, DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useUploadEntityLogo, useDeleteEntityLogo } from '../hooks';
import { DragAndDropBox } from './DragAndDropBox';

export const LogoSelection = () => {
  const { i18n } = useLingui();
  const { data: entity } = useMyEntity();
  const entityId = entity?.id ?? '';
  const { FileInput, openFileInput, checkFileError, resetInput } =
    useFileInput();
  const theme = useTheme();
  const isLowerThanLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState('');
  const {
    mutateAsync: uploadLogo,
    isSuccess: isUploadSuccess,
    isError: isUploadError,
    isPending: isUploading,
    reset: resetUpload,
  } = useUploadEntityLogo();
  const { mutate: deleteLogo, isPending: isDeletingLogo } =
    useDeleteEntityLogo(entityId);

  async function handleUploadLogo(file: File) {
    await uploadLogo({
      body: {
        file,
      },
      path: {
        entity_id: entityId,
      },
    });
  }

  const isUploadInProgress = isUploading || isUploadError || isUploadSuccess;

  return (
    <div
      className={`${isDragging && 'mtw:bg-primary-95'} ${
        isDragging ? 'mtw:box-border!' : 'mtw:box-content!'
      } ${
        isLowerThanLargeScreen
          ? 'mtw:flex-col mtw:h-auto'
          : 'mtw:flex-row mtw:h-30'
      } mtw:flex mtw:gap-6 mtw:justify-between mtw:mb-8`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer?.files?.[0];
        handleUploadLogo(file);
      }}
    >
      {!isUploadInProgress && !isDragging && (
        <Box display="flex" flexDirection="column" gap={2.5}>
          <div>
            <Typography
              variant="h3"
              sx={{ fontSize: '18px', fontWeight: '600' }}
            >{t(i18n)`Company logo`}</Typography>
            <Typography variant="body2">
              {t(i18n)`Drag and drop the image here.`}
              <br />
              {t(i18n)`Or select the file on your computer.`}
            </Typography>
          </div>

          <div className="mtw:flex mtw:gap-2">
            <Button
              variant="outlined"
              onClick={openFileInput}
              sx={{
                width: 'fit-content',
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
                px: 1.5,
                fontSize: 14,
                fontWeight: 500,
                height: '32px',
              }}
            >
              <Upload sx={{ fontSize: 16 }} />
              {t(i18n)`Select file`}
            </Button>

            {entity?.logo && (
              <Button
                variant="text"
                color="error"
                disabled={isDeletingLogo}
                onClick={() => deleteLogo()}
                sx={{
                  width: 'fit-content',
                  display: 'flex',
                  gap: 0.5,
                  alignItems: 'center',
                  px: 1.5,
                  fontSize: 14,
                  fontWeight: 500,
                  height: '32px',
                }}
              >
                <DeleteOutline sx={{ fontSize: 16 }} />
                {t(i18n)`Remove`}
              </Button>
            )}
          </div>
        </Box>
      )}

      {entity?.logo ? (
        <div className="mtw:w-auto mtw:max-h-30">
          <img src={entity?.logo?.url} alt={t(i18n)`Entity logo`} />
        </div>
      ) : (
        <DragAndDropBox
          isUploading={isUploading}
          isSuccess={isUploadSuccess}
          isError={isUploadError}
          isDraggingOver={isDragging}
          fileName={uploadingFileName}
          resetUpload={() => {
            resetInput();
            resetUpload();
            setUploadingFileName('');
          }}
        />
      )}

      <FileInput
        onChange={(event) => {
          const file = event.target.files ? event.target.files[0] : null;
          if (file) {
            const error = checkFileError(file);
            if (error) {
              toast.error(error);
              return;
            }
            setUploadingFileName(file?.name);

            handleUploadLogo(file);
          }
        }}
      />
    </div>
  );
};
