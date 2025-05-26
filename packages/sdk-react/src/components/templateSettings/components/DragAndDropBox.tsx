import { useEffect } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Close,
  Image,
  ErrorOutline,
  CheckCircleOutline,
} from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';

import { UploadBar } from './UploadBar';

type Props = {
  isUploading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDraggingOver: boolean;
  resetUpload: () => void;
  fileName?: string;
};

export const DragAndDropBox = ({
  isUploading,
  isSuccess,
  isError,
  isDraggingOver,
  resetUpload,
  fileName,
}: Props) => {
  const { i18n } = useLingui();

  const isUploadInProgress = isUploading || isSuccess || isError;

  function handleUploadIcon() {
    if (isError) {
      return (
        <ErrorOutline sx={{ fontSize: 20 }} className="mtw:text-danger-50" />
      );
    }

    if (isSuccess) {
      return (
        <CheckCircleOutline
          sx={{ fontSize: 20 }}
          className="mtw:text-success-50"
        />
      );
    }

    return <CircularProgress size={20} />;
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isSuccess) {
      timeoutId = setTimeout(() => resetUpload(), 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [isSuccess, resetUpload]);

  return (
    <div
      className={`${
        isUploadInProgress || isDraggingOver ? 'mtw:w-full' : 'mtw:w-60'
      } ${
        isDraggingOver
          ? 'mtw:border-solid mtw:border-primary-95'
          : 'mtw:border-dashed mtw:border-primary-80'
      } mtw:h-30 mtw:transition-all mtw:flex mtw:flex-col mtw:items-center mtw:justify-center mtw:text-center mtw:gap-3 mtw:rounded-md mtw:border mtw:px-6`}
    >
      {isUploadInProgress ? (
        <>
          <div className="mtw:flex mtw:gap-4 mtw:px-6">
            <div className="mtw:flex mtw:gap-2 mtw:items-center">
              {handleUploadIcon()}
              <span className="mtw:w-[98%] mtw:text-sm mtw:leading-5 mtw:text-medium mtw:text-neutral-50 mtw:overflow-hidden mtw:text-ellipsis mtw:whitespace-nowrap">
                {fileName}
              </span>
            </div>
            <div className="mtw:flex mtw:gap-2 mtw:items-center">
              <UploadBar
                shouldStartProgress={isUploading}
                isError={isError}
                isSuccess={isSuccess}
              />
              {isError && (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={resetUpload}
                  className="mtw:border-none mtw:cursor-pointer"
                >
                  <Close sx={{ fontSize: 16 }} />
                </button>
              )}
            </div>
          </div>

          {isError && (
            <p className="mtw:text-danger-50 mtw:font-medium mtw:text-sm mtw:leading-5">{t(
              i18n
            )`Wrong file format. Please, upload the file in JPEG or PNG format.`}</p>
          )}
        </>
      ) : (
        <>
          <Box padding={0.5} className="mtw:bg-primary-90">
            <Image className="mtw:text-primary-60" />
          </Box>
          {isDraggingOver ? (
            <Typography variant="body2" fontWeight={500}>{t(
              i18n
            )`Drop image here`}</Typography>
          ) : (
            <Typography variant="body2" fontWeight={500}>{t(
              i18n
            )`Supports JPEG and PNG up to 10mb`}</Typography>
          )}
        </>
      )}
    </div>
  );
};
