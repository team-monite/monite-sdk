import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const AccessRestrictionModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { i18n } = useLingui();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mtw:p-8 mtw:pb-4 mtw:gap-12">
        <DialogHeader className="mtw:gap-6">
          <DialogTitle className="mtw:text-2xl mtw:font-semibold mtw:leading-8">{t(
            i18n
          )`Access restricted`}</DialogTitle>
          <DialogDescription>
            {t(i18n)`You don't have permissions to view this page.`}
            <br />
            {t(i18n)`Contact your system administrator for details.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onClose}>{t(i18n)`Close`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
