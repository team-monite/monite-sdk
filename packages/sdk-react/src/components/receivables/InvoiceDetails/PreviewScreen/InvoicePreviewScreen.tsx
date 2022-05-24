import React, { useCallback, useMemo, useState } from 'react';

import { useDialog } from '@/components';
import { ROW_TO_TAG_STATUS_MUI_MAP } from '@/components/receivables/consts';
import { getReceivableStatusNameMap } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { PreviewCustomerSection } from '@/components/receivables/InvoiceDetails/PreviewScreen/sections/PreviewCustomerSection';
import { PreviewDetailsSection } from '@/components/receivables/InvoiceDetails/PreviewScreen/sections/PreviewDetailsSection';
import { PreviewItemsSection } from '@/components/receivables/InvoiceDetails/PreviewScreen/sections/PreviewItemsSection';
import { PreviewPaymentDetailsSection } from '@/components/receivables/InvoiceDetails/PreviewScreen/sections/PreviewPaymentDetailsSection';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import {
  useDeleteReceivableById,
  useIssueReceivableById,
  usePDFReceivableByIdMutation,
  usePDFReceivableById,
  useReceivableById,
  useSendReceivableById,
} from '@/core/queries';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload } from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Radio,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface IPreviewScreenProps {
  receivableId: string;
}

enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

enum PreviewViewEnum {
  Table = 'table',
  Pdf = 'pdf',
}

const DeliveryMethodView = ({
  title,
  description,
  checked,
  disabled,
  deliveryMethod,
  setDeliveryMethod,
}: {
  checked: boolean;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  title: string;
  description: string;
  disabled?: boolean;
}) => {
  return (
    <CardContent
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => !disabled && setDeliveryMethod(deliveryMethod)}
    >
      <Stack alignItems="center" direction="row">
        <Radio
          name="delivery-method"
          value={deliveryMethod}
          checked={checked}
          disabled={disabled}
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </Box>
      </Stack>
    </CardContent>
  );
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      '& .MuiSwitch-thumb:before': {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },
}));

export const InvoicePreviewScreen = (props: IPreviewScreenProps) => {
  const { i18n } = useLingui();
  const [previewView, setPreviewView] = useState<PreviewViewEnum>(
    PreviewViewEnum.Pdf
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.Email
  );
  const dialogContext = useDialog();
  const { data: receivable, isInitialLoading: isInvoiceLoading } =
    useReceivableById(props.receivableId);

  const deleteMutation = useDeleteReceivableById();
  const sendMutation = useSendReceivableById();
  const issueMutation = useIssueReceivableById();
  const pdfMutation = usePDFReceivableByIdMutation(props.receivableId);
  const { data: pdf, isInitialLoading: isPdfLoading } = usePDFReceivableById(
    props.receivableId,
    {
      enabled: previewView === PreviewViewEnum.Pdf,
    }
  );

  const handleSwitchPreview = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPreviewView(
        event.target.checked ? PreviewViewEnum.Pdf : PreviewViewEnum.Table
      );
    },
    []
  );

  const mutationInProgress =
    deleteMutation.isLoading ||
    sendMutation.isLoading ||
    issueMutation.isLoading ||
    pdfMutation.isLoading;

  const handleDeleteInvoice = useCallback(() => {
    deleteMutation.mutate(props.receivableId, {
      onSuccess: () => {
        dialogContext?.onClose?.();
      },
    });
  }, [deleteMutation, dialogContext, props.receivableId]);
  const handleSubmit = useCallback(() => {
    if (deliveryMethod === DeliveryMethod.Email) {
      sendMutation.mutate(
        {
          receivableId: props.receivableId,
          body: {
            body_text: ' ',
            subject_text: ' ',
          },
        },
        {
          onSuccess: () => {
            dialogContext?.onClose?.();
          },
        }
      );

      return;
    }

    if (deliveryMethod === DeliveryMethod.Download) {
      issueMutation.mutate(props.receivableId, {
        onSuccess: () => {
          pdfMutation.mutate(undefined, {
            onSuccess: (data) => {
              window.open(data.file_url, '_blank');
            },
          });
        },
      });
    }
  }, [
    deliveryMethod,
    dialogContext,
    issueMutation,
    pdfMutation,
    props.receivableId,
    sendMutation,
  ]);

  const switcher = useMemo(
    () => (
      <FormGroup>
        <FormControlLabel
          control={
            <CustomSwitch
              checked={previewView === PreviewViewEnum.Pdf}
              onChange={handleSwitchPreview}
            />
          }
          label={
            <Typography variant="body1" fontWeight={500}>{t(
              i18n
            )`PDF preview`}</Typography>
          }
        />
      </FormGroup>
    ),
    [handleSwitchPreview, i18n, previewView]
  );

  if (isInvoiceLoading) {
    return <LoadingPage />;
  }

  if (!receivable) {
    return (
      <NotFound
        title={t(i18n)`Invoice not found`}
        description={t(
          i18n
        )`There is no invoice by provided id: ${props.receivableId}`}
      />
    );
  }

  if (receivable.type !== InvoiceResponsePayload.type.INVOICE) {
    return (
      <NotFound
        title={t(i18n)`Receivable type not supported`}
        description={t(
          i18n
        )`Receivable type ${receivable.type} is not supported. Only ${InvoiceResponsePayload.type.INVOICE} is supported.`}
      />
    );
  }

  return (
    <MoniteStyleProvider>
      <DialogTitle>
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {dialogContext && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={dialogContext?.onClose}
                    aria-label="close"
                    disabled={mutationInProgress}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                <Typography variant="h3">{t(i18n)`Preview invoice`}</Typography>
                <Chip
                  color={ROW_TO_TAG_STATUS_MUI_MAP[receivable.status]}
                  label={getReceivableStatusNameMap(i18n)[receivable.status]}
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                spacing={2}
              >
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleDeleteInvoice}
                  disabled={mutationInProgress}
                >{t(i18n)`Delete draft`}</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={mutationInProgress}
                >{t(i18n)`Issue invoice`}</Button>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={9}
          alignItems="stretch"
          flexGrow={1}
          height="100%"
        >
          <Grid item sm={7} xs={12}>
            {previewView === PreviewViewEnum.Table ? (
              <Stack spacing={4}>
                <PreviewCustomerSection
                  invoice={receivable}
                  rightSection={switcher}
                />
                <PreviewDetailsSection invoice={receivable} />
                <PreviewItemsSection invoice={receivable} />
                <PreviewPaymentDetailsSection invoice={receivable} />
              </Stack>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: 500,
                  overflow: 'auto',
                }}
              >
                {isPdfLoading ? (
                  <LoadingPage />
                ) : (
                  <FileViewer
                    mimetype="application/pdf"
                    url={pdf?.file_url}
                    rightIcon={switcher}
                  />
                )}
              </Box>
            )}
          </Grid>
          <Grid item sm={5} xs={12}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
                  i18n
                )`Delivery method`}</Typography>
                <Card sx={{ borderRadius: 3 }} variant="outlined">
                  <DeliveryMethodView
                    deliveryMethod={DeliveryMethod.Email}
                    setDeliveryMethod={setDeliveryMethod}
                    checked={deliveryMethod === DeliveryMethod.Email}
                    title={t(i18n)`Issue and send via email`}
                    description={t(
                      i18n
                    )`Issue invoice and send it to a customer's email`}
                    disabled={mutationInProgress}
                  />
                  <Divider />
                  <DeliveryMethodView
                    deliveryMethod={DeliveryMethod.Download}
                    setDeliveryMethod={setDeliveryMethod}
                    checked={deliveryMethod === DeliveryMethod.Download}
                    title={t(i18n)`Issue and download PDF`}
                    description={t(
                      i18n
                    )`Issue this invoice to download a valid PDF`}
                    disabled={mutationInProgress}
                  />
                </Card>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </MoniteStyleProvider>
  );
};
