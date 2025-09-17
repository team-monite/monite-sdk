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
import * as React from 'react';

type DatePickerProps = CalendarProps & {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  shouldDisableButton?: boolean;
};

export function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { i18n } = useLingui();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          disabled={Boolean(props.shouldDisableButton)}
          className="mtw:w-full mtw:justify-between mtw:font-normal mtw:border-border"
        >
          {props.selected
            ? props.selected.toLocaleDateString()
            : t(i18n)`Select month`}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mtw:w-auto mtw:overflow-hidden mtw:p-0"
        align="start"
      >
        <Calendar
          {...props}
          mode="single"
          captionLayout="dropdown"
          onSelect={(date) => {
            props.onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
