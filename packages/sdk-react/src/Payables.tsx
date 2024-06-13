import { ReactNode } from 'react';

import {
  PayablesTable,
  PayableDetails,
  PageHeader,
  PayablesProps,
  Dialog,
} from '@/components';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const PageLayoutContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div>{children}</div>;
};

type PageLayoutProps = {
  content: ReactNode;
  details: ReactNode;
  header?: ReactNode;
  extra?: ReactNode;
};

function PageLayout({ header, content, details, extra }: PageLayoutProps) {
  return (
    <PageLayoutContextProvider>
      {header}
      {content}
      {details}
      {extra}
    </PageLayoutContextProvider>
  );
}

function Payables({ onPay }: PayablesProps) {
  const { i18n } = useLingui();

  const isAccessAllowed = false;

  return (
    <PageLayout
      header={<PageHeader title={t(i18n)`Payables`} />}
      content={
        isAccessAllowed ? (
          // Wrap the PayablesTable component with the <FileInput /> component
          <FileInput>
            <PayablesTable
              onPay={onPay}
              onRowClick={(id) => {
                console.log(id);
              }}
            />
          </FileInput>
        ) : (
          <AccessRestriction />
        )
      }
      details={
        // Also it is possible to wrap the PayableDetails component with the <Dialog /> component
        <PayableDetails
          id={undefined}
          onClose={() => {
            console.log('closed');
          }}
        />
      }
      extra={
        <Dialog open={false}>
          <ConfirmDialogContent />
        </Dialog>
      }
    />
  );
}

const FileInput = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const ConfirmDialogContent = () => {
  return null;
};
