import { useCallback, useState, useTransition } from 'react';

import { useDialog } from '@/components';
import { EditInvoiceDetails } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/EditInvoiceDetails';
import { InvoiceCancelModal } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/InvoiceCancelModal';
import { InvoiceDeleteModal } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/InvoiceDeleteModal';
import { Overview } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/Overview';
import { SubmitInvoice } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/SubmitInvoice';
import { ExistingReceivableDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMenuButton } from '@/core/hooks';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { useReceivableById } from '@/core/queries/useReceivables';
import { CenteredContentBox } from '@/ui/box';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmailIcon from '@mui/icons-material/MailOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

import { EmailInvoiceDetails } from './components/EmailInvoiceDetails';
import {
  DeliveryMethod,
  ExistingInvoiceDetailsView,
  useExistingInvoiceDetails,
} from './useExistingInvoiceDetails';

const StyledMenu = styled((props: MenuProps) => {
  const { root } = useRootElements();

  return (
    <Menu
      {...props}
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      container={root}
    />
  );
})(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: `0px 4px 16px 0px ${alpha(theme.palette.secondary.main, 0.4)}`,
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

enum InvoiceDetailsPresentation {
  Overview = 'overview',
  Email = 'email',
}

export const ExistingInvoiceDetails = (
  props: ExistingReceivableDetailsProps
) => (
  <MoniteScopedProviders>
    <ExistingInvoiceDetailsBase {...props} />
  </MoniteScopedProviders>
);

const ExistingInvoiceDetailsBase = (props: ExistingReceivableDetailsProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const [presentation, setPresentation] = useState<InvoiceDetailsPresentation>(
    InvoiceDetailsPresentation.Overview
  );

  const { buttonProps, menuProps } = useMenuButton();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.Email
  );
  const dialogContext = useDialog();
  const { data: receivable, isLoading: isInvoiceLoading } = useReceivableById(
    props.id
  );

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'update',
    entityUserId: receivable?.entity_user_id,
  });

  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [cancelModalOpened, setCancelModalOpened] = useState<boolean>(false);

  const {
    data: pdf,
    isLoading: isPdfLoading,
    error: pdfError,
  } = api.receivables.getReceivablesIdPdfLink.useQuery(
    {
      path: {
        receivable_id: props.id,
      },
    },
    {
      staleTime: 10_000,
      refetchIntervalInBackground: true,
      refetchInterval: api.receivables.getReceivablesIdPdfLink.getQueryData(
        {
          path: { receivable_id: props.id },
        },
        queryClient
      )?.file_url
        ? false
        : 1_000,
    }
  );

  const handleIssueAndSend = useCallback(() => {
    setPresentation(InvoiceDetailsPresentation.Email);
  }, []);

  const { loading, buttons, callbacks, view } = useExistingInvoiceDetails({
    receivableId: props.id,
    receivable: receivable,
    deliveryMethod,
  });

  const [isViewChanging, startViewChange] = useTransition();

  if (isInvoiceLoading || isViewChanging) {
    return <LoadingPage />;
  }

  if (!receivable) {
    return (
      <NotFound
        title={t(i18n)`Invoice not found`}
        description={t(i18n)`There is no invoice by provided id: ${props.id}`}
      />
    );
  }

  if (receivable.type !== 'invoice') {
    return (
      <NotFound
        title={t(i18n)`Receivable type not supported`}
        description={t(
          i18n
        )`Receivable type ${receivable.type} is not supported. Only invoice is supported.`}
      />
    );
  }

  if (view === ExistingInvoiceDetailsView.Edit) {
    return (
      <EditInvoiceDetails
        invoice={receivable}
        onUpdated={() => startViewChange(callbacks.handleChangeViewInvoice)}
        onCancel={() => startViewChange(callbacks.handleChangeViewInvoice)}
      />
    );
  }

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const documentId = receivable.document_id ?? 'INV-auto';

  if (presentation === InvoiceDetailsPresentation.Email) {
    return (
      <EmailInvoiceDetails
        invoiceId={props.id}
        onClose={() => {
          setPresentation(InvoiceDetailsPresentation.Overview);
        }}
      />
    );
  }

  const className = 'Monite-ExistingInvoiceDetails';

  return (
    <>
      <InvoiceDeleteModal
        id={props.id}
        open={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
        }}
      />

      <InvoiceCancelModal
        id={props.id}
        open={cancelModalOpened}
        onClose={() => {
          setCancelModalOpened(false);
        }}
      />

      <DialogTitle className={className + '-Title'}>
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
                    disabled={loading}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                <Typography variant="h3">{t(
                  i18n
                )`Invoice ${documentId}`}</Typography>
                <InvoiceStatusChip status={receivable.status} />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                spacing={2}
              >
                {buttons.isDeleteButtonVisible && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => setDeleteModalOpened(true)}
                    disabled={buttons.isDeleteButtonDisabled}
                  >{t(i18n)`Delete`}</Button>
                )}
                {buttons.isEditButtonVisible && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={(event) => {
                      event.preventDefault();
                      startViewChange(callbacks.handleChangeViewInvoice);
                    }}
                    disabled={loading}
                  >{t(i18n)`Edit invoice`}</Button>
                )}
                {buttons.isMoreButtonVisible && (
                  <>
                    <Button
                      {...buttonProps}
                      variant="text"
                      color="primary"
                      disableElevation
                      disabled={loading}
                      endIcon={<MoreVertIcon />}
                    >{t(i18n)`More`}</Button>
                    <StyledMenu {...menuProps}>
                      <MenuItem
                        onClick={() => {
                          setPresentation(InvoiceDetailsPresentation.Email);
                        }}
                      >
                        <EmailIcon fontSize="small" />
                        {t(i18n)`Send invoice`}
                      </MenuItem>
                      {!buttons.isCancelButtonVisible && (
                        <MenuItem
                          onClick={(event) => {
                            event.preventDefault();
                            setCancelModalOpened(true);
                          }}
                          disabled={buttons.isCancelButtonDisabled}
                        >
                          <CancelIcon fontSize="small" />
                          {t(i18n)`Cancel`}
                        </MenuItem>
                      )}
                    </StyledMenu>
                  </>
                )}
                {buttons.isDownloadPDFButtonVisible && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={callbacks.handleDownloadPDF}
                    disabled={loading}
                  >{t(i18n)`Download PDF`}</Button>
                )}
                {buttons.isComposeEmailButtonVisible && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleIssueAndSend}
                    disabled={loading}
                    endIcon={<KeyboardArrowRightIcon />}
                  >{t(i18n)`Compose email`}</Button>
                )}
                {buttons.isIssueButtonVisible && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={callbacks.handleIssueOnly}
                    disabled={loading}
                  >{t(i18n)`Issue`}</Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </DialogTitle>
      <DialogContent
        className={className + '-Content'}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid container columnSpacing={4} height="100%">
          <Grid item container xs={6} height="100%">
            {isPdfLoading ? (
              <LoadingPage />
            ) : !pdf?.file_url && !pdfError ? (
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
            ) : pdf?.file_url ? (
              <FileViewer
                mimetype="application/pdf"
                url={pdf.file_url}
                onReloadCallback={() =>
                  void api.receivables.getReceivablesIdPdfLink.resetQueries(
                    {
                      parameters: { path: { receivable_id: props.id } },
                    },
                    queryClient
                  )
                }
              />
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            flexDirection="column"
            height="100%"
            overflow="auto"
          >
            <Stack spacing={4}>
              {!isUpdateAllowed ? (
                <Alert severity="info">{t(
                  i18n
                )`You don't have permission to issue this document. Please, contact your system administrator for details.`}</Alert>
              ) : (
                (buttons.isIssueButtonVisible ||
                  buttons.isComposeEmailButtonVisible) && (
                  <SubmitInvoice
                    deliveryMethod={deliveryMethod}
                    onDeliveryMethodChanged={setDeliveryMethod}
                    disabled={loading}
                  />
                )
              )}
              <Overview {...receivable} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};
