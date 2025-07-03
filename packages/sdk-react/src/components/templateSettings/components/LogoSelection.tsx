import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useFileInput } from '@/core/hooks';
import { useMyEntity } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Upload, DeleteOutline } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

import { useUploadEntityLogo, useDeleteEntityLogo } from '../hooks';
import { DragAndDropBox } from './DragAndDropBox';

type Props = {
  shouldApplyDialogStyles?: boolean;
};

export const LogoSelection = ({ shouldApplyDialogStyles }: Props) => {
  const { i18n } = useLingui();
  const { data: entity } = useMyEntity();
  const entityId = entity?.id ?? '';
  const { FileInput, openFileInput, checkFileError, resetInput } =
    useFileInput();
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

  async function handleUploadLogo(file: File | null) {
    if (file) {
      const error = checkFileError(file);
      if (error) {
        toast.error(error);
        return;
      }

      setUploadingFileName(file?.name);
      await uploadLogo({
        body: {
          file,
        },
        path: {
          entity_id: entityId,
        },
      });
    }
  }

  const isUploadInProgress = isUploading || isUploadError;

  return (
    <div
      className={`${isDragging && 'mtw:bg-primary-95'} ${
        isDragging ? 'mtw:box-border!' : 'mtw:box-content!'
      } ${
        shouldApplyDialogStyles
          ? 'mtw:sm:flex-row mtw:h-30 mtw:md:flex-col mtw:md:h-auto mtw:lg:flex-row mtw:lg:h-30 mtw:lg:justify-between'
          : 'mtw:h-auto mtw:md:flex-row mtw:md:h-30 mtw:lg:flex-col mtw:lg:h-auto mtw:xl:flex-row mtw:xl:h-30 mtw:xl:justify-between'
      } mtw:flex mtw:flex-col mtw:gap-6 mtw:mb-8`}
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

        const file = event.dataTransfer?.files
          ? event.dataTransfer?.files?.[0]
          : null;
        handleUploadLogo(file);
      }}
    >
      {!isUploadInProgress && Boolean(!uploadingFileName) && !isDragging && (
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

      {entity?.logo && Boolean(!uploadingFileName) ? (
        <div
          className={`mtw:flex mtw:w-60 mtw:h-30 mtw:box-border mtw:justify-end ${
            shouldApplyDialogStyles
              ? 'mtw:md:justify-start mtw:lg:justify-end'
              : 'mtw:lg:justify-start mtw:xl:justify-end'
          }`}
        >
          <img
            src={entity?.logo?.url}
            className="mtw:w-auto mtw:max-w-full mtw:object-contain mtw:max-h-30"
            alt={t(i18n)`Entity logo`}
          />
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
          handleUploadLogo(file);
        }}
      />
    </div>
  );
};
