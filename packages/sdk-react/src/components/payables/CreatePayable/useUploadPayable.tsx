import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useFileInput } from '@/core/hooks';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const useUploadPayable = () => {
  const { FileInput, openFileInput } = useFileInput();

  const { api, queryClient } = useMoniteContext();
  const payableUploadFromFileMutation =
    api.payables.postPayablesUploadFromFile.useMutation(
      {},
      {
        onSuccess: () =>
          api.payables.getPayables.invalidateQueries(queryClient),
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  return {
    FileInput: () => {
      return (
        <FileInput
          accept="application/pdf, image/png, image/jpeg, image/tiff"
          aria-label={t(i18n)`Upload payable file`}
          onChange={(event) => {
            const file = event.target.files?.item(0);

            if (!file) {
              return;
            }

            if (
              ![
                'application/pdf',
                'image/png',
                'image/jpeg',
                'image/tiff',
              ].includes(file.type)
            ) {
              toast.error(t(i18n)`Unsupported file format`);
              return;
            }

            toast.promise(
              payableUploadFromFileMutation.mutateAsync({
                file,
              }),
              {
                loading: t(i18n)`Uploading payable file`,
                success: t(i18n)`Payable uploaded successfully`,
                error: (error) => getAPIErrorMessage(i18n, error),
              }
            );
          }}
        />
      );
    },
    openFileInput,
  };
};
