import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { CenteredContentBox } from '@/ui/box';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material';

export const InvoicePDFViewer = ({
  receivable_id,
}: {
  receivable_id: string;
}) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  const pdfLink = api.receivables.getReceivablesIdPdfLink.getQueryData(
    {
      path: { receivable_id },
    },
    queryClient
  );

  const { data, isLoading, error } =
    api.receivables.getReceivablesIdPdfLink.useQuery(
      {
        path: {
          receivable_id,
        },
      },
      {
        staleTime: 10_000,
        refetchIntervalInBackground: true,
        refetchInterval: pdfLink?.file_url ? false : 1_000,
      }
    );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <FormHelperText>{getAPIErrorMessage(i18n, error)}</FormHelperText>;
  }

  if (data?.file_url === '') {
    return (
      <Box
        sx={{
          padding: 4,
        }}
      >
        <Stack alignItems="center" gap={2}>
          <ErrorOutlineIcon color="error" />
          <Stack gap={0.5} alignItems="center">
            <Typography variant="body1" fontWeight="bold">{t(
              i18n
            )`Failed to load PDF Viewer`}</Typography>
            <Stack alignItems="center">
              <Typography variant="body2">{t(
                i18n
              )`Please try to reload.`}</Typography>
              <Typography variant="body2">{t(
                i18n
              )`If the error recurs, contact support.`}</Typography>
            </Stack>
            <Button
              variant="text"
              onClick={
                void api.receivables.getReceivablesIdPdfLink.resetQueries(
                  {
                    parameters: { path: { receivable_id } },
                  },
                  queryClient
                )
              }
              startIcon={<RefreshIcon />}
            >{t(i18n)`Reload`}</Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (!data?.file_url) {
    return (
      <CenteredContentBox>
        <Stack alignItems="center" gap={2}>
          <CircularProgress />
          <Box textAlign="center">
            <Typography variant="body2" fontWeight="500">{t(
              i18n
            )`Updating the invoice`}</Typography>
            <Typography variant="body2" fontWeight="500">{t(
              i18n
            )`information...`}</Typography>
          </Box>
        </Stack>
      </CenteredContentBox>
    );
  }

  return <FileViewer mimetype="application/pdf" url={data.file_url} />;
};
