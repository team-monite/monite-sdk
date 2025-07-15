import { useId, useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { CustomerTypes } from '@/components/counterparts/types';
import { PayableDetailsAttachFile } from '@/components/payables/PayableDetails/PayableDetailsAttachFile';
import { PayableDetailsHeader } from '@/components/payables/PayableDetails/PayableDetailsHeader';
import { PayableDetailsInfo } from '@/components/payables/PayableDetails/PayableDetailsInfo';
import { PayableDetailsNoAttachedFile } from '@/components/payables/PayableDetails/PayableDetailsNoAttachedFile';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, Backdrop, Box, DialogContent, Grid } from '@mui/material';

import { OptionalFields } from '../types';
import { PayableDetailsForceActionDialog } from './PayableDetailsApprovalFlow/PayableDetailsForceActionDialog';
import { PayableDetailsForm } from './PayableDetailsForm';
import { usePayableDetails, UsePayableDetailsProps } from './usePayableDetails';

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
  optionalFields?: OptionalFields;
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
}

export const PayableDetails = (props: PayablesDetailsProps) => (
  <MoniteScopedProviders>
    <PayableDetailsBase {...props} />
  </MoniteScopedProviders>
);

const PayableDetailsBase = ({
  id,
  optionalFields,
  customerTypes,
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
    showPayButton,
    actions: {
      setEdit,
      createInvoice,
      saveInvoice,
      submitInvoice,
      payInvoice,
      rejectInvoice,
      approveInvoice,
      forceRejectInvoice,
      forceApproveInvoice,
      cancelInvoice,
      reopenInvoice,
      deleteInvoice,
      updateTags,
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

  const [forceDialog, setForceDialog] = useState<null | 'approve' | 'reject'>(
    null
  );
  const handleForceDialogClose = () => setForceDialog(null);
  const handleForceApprove = async () => {
    handleForceDialogClose();
    await forceApproveInvoice();
  };
  const handleForceReject = async () => {
    handleForceDialogClose();
    await forceRejectInvoice();
  };
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

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
          forceRejectInvoice={() => setForceDialog('reject')}
          forceApproveInvoice={() => setForceDialog('approve')}
          reopenInvoice={reopenInvoice}
          cancelInvoice={cancelInvoice}
          deleteInvoice={deleteInvoice}
          payInvoice={payInvoice}
          payableDetailsFormId={payableDetailsFormId}
          onClose={onClose}
          modalComponent={modalComponent}
          showPayButton={showPayButton}
        />
        <PayableDetailsForceActionDialog
          open={forceDialog === 'approve'}
          type="approve"
          onClose={handleForceDialogClose}
          onConfirm={handleForceApprove}
        />
        <PayableDetailsForceActionDialog
          open={forceDialog === 'reject'}
          type="reject"
          onClose={handleForceDialogClose}
          onConfirm={handleForceReject}
        />
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
                  customerTypes={
                    customerTypes ||
                    componentSettings?.counterparts?.customerTypes
                  }
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
