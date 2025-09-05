import { useMarkAsUncollectibleReceivableById } from '../hooks/useMarkAsUncollectibleReceivableById';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { Label } from '@/ui/components/label';
import { Textarea } from '@/ui/components/textarea';
import { LoadingSpinner } from '@/ui/loading/LoadingSpinner';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

interface MarkAsUncollectibleModalProps {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
  onMarkAsUncollectible?: (id: string) => void;
}

export const MarkAsUncollectibleModal = ({
  invoiceId,
  open,
  onClose,
  onMarkAsUncollectible,
}: MarkAsUncollectibleModalProps) => {
  const { i18n } = useLingui();
  const [comment, setComment] = useState('');
  const { mutate: markAsUncollectible, isPending: isMarkingAsUncollectible } =
    useMarkAsUncollectibleReceivableById(invoiceId, onMarkAsUncollectible);

  const handleMarkAsUncollectible = () => {
    markAsUncollectible(
      {
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t(i18n)`Mark invoice as uncollectible?`}</DialogTitle>
          <DialogDescription>
            <p>
              {t(
                i18n
              )`This invoice will change its status, and you won't be able to receive or log any payment against it.`}
            </p>
            <br />
            <p>
              {t(
                i18n
              )`For bookkeeping purposes, this is a write-off and has tax implications.`}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mtw:flex mtw:flex-col mtw:gap-2">
          <Label htmlFor="comment">{t(i18n)`Comment (optional)`}</Label>
          <Textarea
            id="comment"
            placeholder={t(i18n)`Add a comment`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            onClick={handleMarkAsUncollectible}
            disabled={isMarkingAsUncollectible}
          >
            {isMarkingAsUncollectible && (
              <LoadingSpinner className="mtw:w-5 mtw:h-5 mtw:border-inherit mtw:border-t-transparent" />
            )}
            {t(i18n)`Mark as uncollectible`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
