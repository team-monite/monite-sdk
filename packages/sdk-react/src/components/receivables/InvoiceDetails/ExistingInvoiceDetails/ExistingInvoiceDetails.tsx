import React, { useCallback, useMemo, useState } from 'react';

import { useDialog } from '@/components';
import { ROW_TO_TAG_STATUS_MUI_MAP } from '@/components/receivables/consts';
import { Overview } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/Overview';
import { SubmitInvoice } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/SubmitInvoice';
import {
  ExistingReceivableDetailsProps,
  getReceivableStatusNameMap,
} from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { usePDFReceivableById, useReceivableById } from '@/core/queries';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload, ReceivablesStatusEnum } from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmailIcon from '@mui/icons-material/MailOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Chip,
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
import { useExistingInvoiceDetails } from './useExistingInvoiceDetails';

enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

const StyledMenu = styled((props: MenuProps) => {
  const { root } = useRootElements();

  return (
    <Menu
      elevation={0}
      container={root}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  );
})(({ theme }) => ({
  '& .MuiPaper-root': {
    // borderRadius: theme.spacing(2),
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

enum InvoiceDetailsView {
  Overview = 'overview',
  Email = 'email',
}

export const ExistingInvoiceDetails = (
  props: ExistingReceivableDetailsProps
) => {
  const { i18n } = useLingui();
  const [view, setView] = useState<InvoiceDetailsView>(
    InvoiceDetailsView.Overview
  );
  const [moreElement, setMoreElement] = React.useState<null | HTMLElement>(
    null
  );
  const isMoreOpen = useMemo(() => Boolean(moreElement), [moreElement]);
  const handleOpenMore = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMoreElement(event.currentTarget);
  }, []);
  const handleCloseMore = useCallback(() => {
    setMoreElement(null);
  }, []);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.Email
  );
  const dialogContext = useDialog();
  const { data: receivable, isInitialLoading: isInvoiceLoading } =
    useReceivableById(props.id);

  const { data: pdf, isInitialLoading: isPdfLoading } = usePDFReceivableById(
    props.id
  );

  const handleIssueAndSend = useCallback(() => {
    setView(InvoiceDetailsView.Email);
  }, []);

  const { loading, buttons, callbacks } = useExistingInvoiceDetails({
    receivableId: props.id,
    receivable,
    deliveryMethod,
  });

  if (isInvoiceLoading) {
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

  /**
   * We don't need to localize this string
   * because we will put `documentId` into i18n later
   */
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const documentId = receivable.document_id ?? 'INV-auto';

  if (view === InvoiceDetailsView.Email) {
    return (
      <EmailInvoiceDetails
        invoiceId={props.id}
        onClose={() => {
          setView(InvoiceDetailsView.Overview);
        }}
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
                    disabled={loading}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                <Typography variant="h3">{t(
                  i18n
                )`Invoice ${documentId}`}</Typography>
                <Chip
                  color={ROW_TO_TAG_STATUS_MUI_MAP[receivable.status]}
                  label={getReceivableStatusNameMap(i18n)[receivable.status]}
                  variant="filled"
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
                {receivable.status === ReceivablesStatusEnum.DRAFT && (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={callbacks.handleDeleteInvoice}
                    disabled={loading}
                  >{t(i18n)`Delete`}</Button>
                )}
                {buttons.isMoreButtonVisible && (
                  <React.Fragment>
                    <Button
                      aria-controls={isMoreOpen ? 'more-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={isMoreOpen ? 'true' : undefined}
                      variant="text"
                      color="primary"
                      disableElevation
                      onClick={handleOpenMore}
                      disabled={loading}
                      endIcon={<MoreVertIcon />}
                    >{t(i18n)`More`}</Button>
                    <StyledMenu
                      anchorEl={moreElement}
                      open={isMoreOpen}
                      onClose={handleCloseMore}
                    >
                      <MenuItem
                        onClick={() => {
                          handleCloseMore();
                          setView(InvoiceDetailsView.Email);
                        }}
                      >
                        <EmailIcon fontSize="small" />
                        {t(i18n)`Send invoice`}
                      </MenuItem>
                    </StyledMenu>
                  </React.Fragment>
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
      <DialogContent>
        <Grid
          container
          spacing={9}
          alignItems="stretch"
          flexGrow={1}
          height="100%"
        >
          <Grid item sm={7} xs={12}>
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
                <FileViewer mimetype="application/pdf" url={pdf?.file_url} />
              )}
            </Box>
          </Grid>
          <Grid item sm={5} xs={12}>
            <Stack spacing={4}>
              <SubmitInvoice
                deliveryMethod={deliveryMethod}
                onDeliveryMethodChanged={setDeliveryMethod}
                disabled={loading}
              />
              <Overview invoice={receivable} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </MoniteStyleProvider>
  );
};
