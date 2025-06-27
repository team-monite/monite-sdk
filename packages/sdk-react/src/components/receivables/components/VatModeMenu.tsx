import { useFormContext } from 'react-hook-form';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { ChevronDownIcon } from 'lucide-react';

import { CreateReceivablesFormProps } from '../InvoiceDetails/CreateReceivable/validation';

type VatModeMenuProps = {
  disabled?: boolean;
};

export function VatModeMenu({ disabled }: VatModeMenuProps) {
  const { i18n } = useLingui();
  const { setValue, watch } = useFormContext<CreateReceivablesFormProps>();
  const isInclusivePricing = watch('vat_mode') === 'inclusive';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className="mtw:text-primary-50 mtw:font-medium mtw:text-sm mtw:flex mtw:items-center mtw:gap-1"
          disabled={disabled}
        >
          {t(i18n)`${isInclusivePricing ? 'Incl.' : 'Excl.'} tax`}
          {!disabled && <ChevronDownIcon className="mtw:w-4 mtw:h-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setValue('vat_mode', 'exclusive')}>
          {t(i18n)`Excluding tax`}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setValue('vat_mode', 'inclusive')}>
          {t(i18n)`Including tax`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
