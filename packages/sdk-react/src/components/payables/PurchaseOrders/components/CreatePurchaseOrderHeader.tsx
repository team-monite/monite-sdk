import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { Button } from '@/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Settings } from 'lucide-react';
import { memo } from 'react';

interface CreatePurchaseOrderHeaderProps {
  className: string;
  actualCurrency: string;
  isLoading: boolean;
  onCurrencyModalOpen: () => void;
  onTemplateModalOpen: () => void;
  onSave: () => void;
}

export const CreatePurchaseOrderHeader = memo(
  ({
    className,
    actualCurrency,
    isLoading,
    onCurrencyModalOpen,
    onTemplateModalOpen,
    onSave,
  }: CreatePurchaseOrderHeaderProps) => {
    const { i18n } = useLingui();

    return (
      <FullScreenModalHeader
        className={className + '-Title PurchaseOrder-Preview'}
        title={t(i18n)`Create purchase order`}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="mtw:mr-2"
                  disabled={isLoading}
                >
                  <Settings className="mtw:h-4 mtw:w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onCurrencyModalOpen}>
                  <div className="mtw:flex mtw:w-full mtw:items-center mtw:justify-between">
                    <span className="mtw:text-sm mtw:text-muted-foreground">{t(i18n)`Currency`}</span>
                    <span className="mtw:text-sm mtw:font-medium">{actualCurrency}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onTemplateModalOpen}>
                  {t(i18n)`Edit template settings`}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              onClick={onSave}
            >
              {t(i18n)`Save`}
            </Button>
          </>
        }
      />
    );
  }
);
