import { UserTransactionsTable } from './ExpensesTable/UserTransactionsTable';
import { ReceiptsInbox } from './ReceiptsInbox';
import { PageHeader } from '@/ui/PageHeader';
import { Button } from '@/ui/components/button';
import { Dialog } from '@/ui/components/dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ArchiveIcon } from 'lucide-react';
import { useState } from 'react';

export const Expenses = () => {
  const { i18n } = useLingui();

  const [receiptsInboxOpened, setReceiptsInboxOpened] =
    useState<boolean>(false);

  return (
    <div
      className="mtw:flex mtw:flex-col mtw:h-full Monite-ExpensesPage"
      data-testid="Monite-ExpensesPage"
    >
      <div className="mtw:flex-shrink-0">
        <PageHeader
          title={t(i18n)`Expenses`}
          extra={
            <div>
              <Button
                variant="secondary"
                className="mtw:rounded-2xl mtw:text-accent-foreground"
                onClick={() => setReceiptsInboxOpened(true)}
                title={t(i18n)`Open receipts inbox`}
                aria-label={t(i18n)`Open receipts inbox`}
              >
                <ArchiveIcon />
              </Button>
            </div>
          }
        />
      </div>
      <div className="mtw:flex-1 mtw:min-h-0">
        <UserTransactionsTable />
      </div>
      {receiptsInboxOpened && (
        <Dialog
          open={receiptsInboxOpened}
          onOpenChange={setReceiptsInboxOpened}
        >
          <ReceiptsInbox setIsOpen={setReceiptsInboxOpened} />
        </Dialog>
      )}
    </div>
  );
};
