import { ReceiptsInbox } from './ReceiptsInbox';
import { TransactionsTable } from './TransactionsTable';
import { useEntityUserByAuthToken } from '@/core/queries/useEntityUsers';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { PageHeader } from '@/ui/PageHeader';
import { Button } from '@/ui/components/button';
import { Dialog } from '@/ui/components/dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ArchiveIcon } from 'lucide-react';
import { useState } from 'react';

export const Transactions = () => {
  const { i18n } = useLingui();
  const { data: user } = useEntityUserByAuthToken();

  const [receiptsInboxOpened, setReceiptsInboxOpened] =
    useState<boolean>(false);

  const { data: isReadReceiptsAllowed } = useIsActionAllowed({
    method: 'receipt',
    action: 'read',
    entityUserId: user?.id,
  });

  return (
    <div
      className="mtw:flex mtw:flex-col mtw:h-full Monite-TransactionsPage"
      data-testid="Monite-TransactionsPage"
    >
      <div className="mtw:flex-shrink-0">
        <PageHeader
          title={t(i18n)`Transactions`}
          extra={
            <div>
              <Button
                variant="secondary"
                className="mtw:rounded-2xl mtw:text-accent-foreground"
                onClick={() => setReceiptsInboxOpened(true)}
                title={t(i18n)`Open receipts inbox`}
                aria-label={t(i18n)`Open receipts inbox`}
                disabled={!isReadReceiptsAllowed}
              >
                <ArchiveIcon />
              </Button>
            </div>
          }
        />
      </div>
      <div className="mtw:flex-1 mtw:min-h-0">
        <TransactionsTable />
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
