import { useId } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { PayableDetailsAttachFile } from '@/components/payables/PayableDetails/PayableDetailsAttachFile';
import { PayableDetailsHeader } from '@/components/payables/PayableDetails/PayableDetailsHeader';
import { PayableDetailsInfo } from '@/components/payables/PayableDetails/PayableDetailsInfo';
import { PayableDetailsNoAttachedFile } from '@/components/payables/PayableDetails/PayableDetailsNoAttachedFile';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Alert,
  Backdrop,
  Box,
  DialogContent,
  Divider,
  Grid,
} from '@mui/material';

import { OptionalFields } from '../types';
import { PayableDetailsForm } from './PayableDetailsForm';
import { usePayableDetails, UsePayableDetailsProps } from './usePayableDetails';

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
  optionalFields?: OptionalFields;
}

export const PayableDetails = (props: PayablesDetailsProps) => (
  <MoniteScopedProviders>
    <PayableDetailsBase {...props} />
  </MoniteScopedProviders>
);

const PayableDetailsBase = ({
  id,
  optionalFields,
  onClose,
  onSaved,
  onCanceled,
  onSubmitted,
  onRejected,
  onApproved,
  onReopened,
  onDeleted,
  onPay,
  onPayUS,
}: PayablesDetailsProps) => {
  const {
    payable,
    payableQueryError,
    permissions,
    lineItems,
    isEdit,
    isLoading,
    isProcessingPayment,
    actions: {
      setEdit,
      createInvoice,
      saveInvoice,
      submitInvoice,
      payInvoice,
      rejectInvoice,
      approveInvoice,
      cancelInvoice,
      reopenInvoice,
      deleteInvoice,
      updateTags,
      isPaymentLinkAvailable,
      modalComponent,
    },
  } = usePayableDetails({
    id,
    onSaved,
    onCanceled,
    onSubmitted,
    onRejected,
    onApproved,
    onReopened,
    onDeleted,
    onPay,
    onPayUS,
  });
  const { i18n } = useLingui();

  const { data: isUpdateAllowed, isLoading: isUpdateAllowedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'update',
      entityUserId: payable?.was_created_by_user_id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'read',
      entityUserId: payable?.was_created_by_user_id,
    });

  const payableDetailsFormId = `Monite-PayableDetailsForm-${useId()}`;

  if (isReadAllowedLoading || isUpdateAllowedLoading) {
    return <LoadingPage />;
  }

  if (!isReadAllowed) {
    return <AccessRestriction />;
  }

  if (payableQueryError) {
    return (
      <NotFound
        title={t(i18n)`Payable not found`}
        description={t(i18n)`There is no payable by provided id: ${id}`}
      />
    );
  }

  const className = 'Monite-PayableDetails';
  return (
    <>
      <Box
        className={classNames(ScopedCssBaselineContainerClassName, className)}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
        }}
      >
        <Backdrop
          open={isLoading}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <LoadingPage />
        </Backdrop>
        <PayableDetailsHeader
          payable={payable}
          permissions={permissions}
          setEdit={setEdit}
          isEdit={isEdit}
          submitInvoice={submitInvoice}
          rejectInvoice={rejectInvoice}
          approveInvoice={approveInvoice}
          reopenInvoice={reopenInvoice}
          cancelInvoice={cancelInvoice}
          deleteInvoice={deleteInvoice}
          payInvoice={payInvoice}
          payableDetailsFormId={payableDetailsFormId}
          onClose={onClose}
          isPaymentLinkAvailable={isPaymentLinkAvailable}
          isProcessingPayment={isProcessingPayment}
          modalComponent={modalComponent}
        />
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid container columnSpacing={4} height="100%">
            <Grid item container xs={6} height="100%">
              {payable?.file && (
                <FileViewer
                  name={payable.file.name}
                  mimetype={payable.file.mimetype}
                  url={payable.file.url}
                />
              )}
              {isUpdateAllowed && payable?.id && !payable?.file && (
                <PayableDetailsAttachFile payableId={payable.id} />
              )}
              {!isUpdateAllowed && payable?.id && !payable?.file && (
                <PayableDetailsNoAttachedFile />
              )}
            </Grid>
            <Grid
              item
              container
              xs={6}
              flexDirection="column"
              height="100%"
              overflow="auto"
            >
              {payable &&
                (payable.status === 'new' || payable.status === 'draft') &&
                payable.ocr_status === 'error' && (
                  <Box mb={2}>
                    <Alert severity="error">
                      {t(
                        i18n
                      )`Due to an error, the OCR failed to read the data from the document. Please input the data manually.`}
                    </Alert>
                  </Box>
                )}
              {isEdit ? (
                <PayableDetailsForm
                  savePayable={saveInvoice}
                  createPayable={createInvoice}
                  payable={payable}
                  optionalFields={optionalFields}
                  lineItems={lineItems}
                  payableDetailsFormId={payableDetailsFormId}
                />
              ) : (
                payable && (
                  <PayableDetailsInfo
                    updateTags={(tags) => id && updateTags(id, tags || [])}
                    payable={payable}
                    optionalFields={optionalFields}
                  />
                )
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </>
  );
};
