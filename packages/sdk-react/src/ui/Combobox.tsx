import * as React from 'react';

import { Button } from '@/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Check, ChevronsUpDown } from 'lucide-react';

type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  noOptionSelectedLabel?: string;
};

export function Combobox({ options, noOptionSelectedLabel }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const { i18n } = useLingui();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mtw:w-[200px] mtw:justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : noOptionSelectedLabel || t(i18n)`Select an option`}
          <ChevronsUpDown className="mtw:opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mtw:w-[200px] mtw:p-0">
        <Command>
          <CommandInput placeholder={t(i18n)`Search`} className="mtw:h-9" />
          <CommandList>
            <CommandEmpty>{t(i18n)`No option found.`}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'mtw:ml-auto',
                      value === option.value
                        ? 'mtw:opacity-100'
                        : 'mtw:opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
