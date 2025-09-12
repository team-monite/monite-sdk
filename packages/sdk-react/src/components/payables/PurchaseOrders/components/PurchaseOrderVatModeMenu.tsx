import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, memo } from 'react';

export type DropdownOption<T = string> = {
  value: T;
  label: string;
  displayLabel?: string;
};

const DEFAULT_PLACEHOLDER = 'Select an option';
const DEFAULT_TRIGGER_CLASSNAME =
  'mtw:text-primary-50 mtw:font-medium mtw:text-sm mtw:flex mtw:items-center mtw:gap-1';

type GenericDropdownMenuProps<T = string> = {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
};

export function GenericDropdownMenu<T = string>({
  value,
  options,
  disabled = false,
  placeholder = DEFAULT_PLACEHOLDER,
  triggerClassName = DEFAULT_TRIGGER_CLASSNAME,
  onChange,
}: GenericDropdownMenuProps<T>) {
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const displayText = useMemo(
    () => selectedOption?.displayLabel || selectedOption?.label || placeholder,
    [selectedOption, placeholder]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button type="button" className={triggerClassName} disabled={disabled}>
          {displayText}
          {!disabled && <ChevronDownIcon className="mtw:w-4 mtw:h-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={String(option.value)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type VatMode = 'exclusive' | 'inclusive' | 'no_vat';

type PurchaseOrderVatModeMenuProps = {
  value: VatMode;
  disabled?: boolean;
  onChange: (value: VatMode) => void;
};

export const PurchaseOrderVatModeMenu = memo(
  ({ value, disabled = false, onChange }: PurchaseOrderVatModeMenuProps) => {
    const { i18n } = useLingui();

    const vatModeOptions: DropdownOption<VatMode>[] = useMemo(
      () => [
        {
          value: 'exclusive',
          label: t(i18n)`Excluding tax`,
          displayLabel: t(i18n)`Excl. tax`,
        },
        {
          value: 'inclusive',
          label: t(i18n)`Including tax`,
          displayLabel: t(i18n)`Incl. tax`,
        },
        {
          value: 'no_vat',
          label: t(i18n)`No VAT`,
          displayLabel: t(i18n)`No VAT`,
        },
      ],
      [i18n]
    );

    return (
      <GenericDropdownMenu
        value={value}
        onChange={onChange}
        options={vatModeOptions}
        disabled={disabled}
        placeholder={t(i18n)`Select VAT mode`}
      />
    );
  }
);
