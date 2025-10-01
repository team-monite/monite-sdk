import { cn } from './lib/utils';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { Button } from '@/ui/components/button';
import { Calendar, CalendarProps } from '@/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

type DatePickerProps = CalendarProps & {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  showClearButton?: boolean;
  onClear: () => void;
  shouldDisableButton?: boolean;
  label?: string;
  className?: string;
  calendarProps?: CalendarProps;
};

export function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const { i18n } = useLingui();
  const triggerLabel = props.label || t(i18n)`Select date`;
  const root = useRootElements();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'mtw:w-full mtw:justify-between mtw:font-normal mtw:border-border',
            props.className
          )}
          variant="outline"
          id="date"
          disabled={Boolean(props.shouldDisableButton)}
        >
          {props.selected
            ? props.selected.toLocaleDateString(i18n.locale)
            : triggerLabel}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        container={root?.root}
        className="mtw:w-auto mtw:overflow-hidden mtw:p-0"
        align="start"
      >
        <Calendar
          {...props.calendarProps}
          mode="single"
          captionLayout="dropdown"
          selected={props.selected}
          onSelect={(date) => {
            props.onSelect(date);
            setOpen(false);
          }}
        />
        {props.showClearButton && (
          <div className="mtw:p-3 mtw:border-t mtw:border-border">
            <Button
              disabled={!props.selected}
              variant="outline"
              onClick={() => {
                if (props.onClear) {
                  props.onClear();
                }
                setOpen(false);
              }}
            >
              {t(i18n)`Clear`}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
