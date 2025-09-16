import { Button, buttonVariants } from '@/ui/components/button';
import { cn } from '@/ui/lib/utils';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import * as React from 'react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'mtw:bg-background mtw:group/calendar mtw:p-3 mtw:[--cell-size:--spacing(8)] mtw:[[data-slot=card-content]_&]:bg-transparent mtw:[[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('mtw:w-fit', defaultClassNames.root),
        months: cn(
          'mtw:flex mtw:gap-4 mtw:flex-col mtw:md:flex-row mtw:relative',
          defaultClassNames.months
        ),
        month: cn(
          'mtw:flex mtw:flex-col mtw:w-full mtw:gap-4',
          defaultClassNames.month
        ),
        nav: cn(
          'mtw:flex mtw:items-center mtw:gap-1 mtw:w-full mtw:absolute mtw:top-0 mtw:inset-x-0 mtw:justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'mtw:size-(--cell-size) mtw:aria-disabled:opacity-50 mtw:p-0 mtw:select-none',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'mtw:size-(--cell-size) mtw:aria-disabled:opacity-50 mtw:p-0 mtw:select-none',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'mtw:flex mtw:items-center mtw:justify-center mtw:h-(--cell-size) mtw:w-full mtw:px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'mtw:w-full mtw:flex mtw:items-center mtw:text-sm mtw:font-medium mtw:justify-center mtw:h-(--cell-size) mtw:gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'mtw:relative mtw:has-focus:border-ring mtw:border mtw:border-input mtw:shadow-xs mtw:has-focus:ring-ring/50 mtw:has-focus:ring-[3px] mtw:rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'mtw:absolute mtw:bg-popover mtw:inset-0 mtw:opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'mtw:select-none mtw:font-medium',
          captionLayout === 'label'
            ? 'mtw:text-sm'
            : 'mtw:rounded-md mtw:pl-2 mtw:pr-1 mtw:flex mtw:items-center mtw:gap-1 mtw:text-sm mtw:h-8 mtw:[&>svg]:text-muted-foreground mtw:[&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        table: 'mtw:w-full mtw:border-collapse',
        weekdays: cn('mtw:flex', defaultClassNames.weekdays),
        weekday: cn(
          'mtw:text-muted-foreground mtw:rounded-md mtw:flex-1 mtw:font-normal mtw:text-[0.8rem] mtw:select-none',
          defaultClassNames.weekday
        ),
        week: cn('mtw:flex mtw:w-full mtw:mt-2', defaultClassNames.week),
        week_number_header: cn(
          'mtw:select-none mtw:w-(--cell-size)',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'mtw:text-[0.8rem] mtw:select-none mtw:text-muted-foreground',
          defaultClassNames.week_number
        ),
        day: cn(
          'mtw:relative mtw:w-full mtw:h-full mtw:p-0 mtw:text-center mtw:[&:first-child[data-selected=true]_button]:rounded-l-md mtw:[&:last-child[data-selected=true]_button]:rounded-r-md mtw:group/day mtw:aspect-square mtw:select-none',
          defaultClassNames.day
        ),
        range_start: cn(
          'mtw:rounded-l-md mtw:bg-accent',
          defaultClassNames.range_start
        ),
        range_middle: cn('mtw:rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'mtw:rounded-r-md mtw:bg-accent',
          defaultClassNames.range_end
        ),
        today: cn(
          'mtw:bg-accent mtw:text-accent-foreground mtw:rounded-md mtw:data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'mtw:text-muted-foreground mtw:aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          'mtw:text-muted-foreground mtw:opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('mtw:invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('mtw:size-4', className)}
                {...props}
              />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('mtw:size-4', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn('mtw:size-4', className)}
              {...props}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="mtw:flex mtw:size-(--cell-size) mtw:items-center mtw:justify-center mtw:text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'mtw:data-[selected-single=true]:bg-primary mtw:data-[selected-single=true]:text-primary-foreground mtw:data-[range-middle=true]:bg-accent mtw:data-[range-middle=true]:text-accent-foreground mtw:data-[range-start=true]:bg-primary mtw:data-[range-start=true]:text-primary-foreground mtw:data-[range-end=true]:bg-primary mtw:data-[range-end=true]:text-primary-foreground mtw:group-data-[focused=true]/day:border-ring mtw:group-data-[focused=true]/day:ring-ring/50 mtw:dark:hover:text-accent-foreground mtw:flex mtw:aspect-square mtw:size-auto mtw:w-full mtw:min-w-(--cell-size) mtw:flex-col mtw:gap-1 mtw:leading-none mtw:font-normal mtw:group-data-[focused=true]/day:relative mtw:group-data-[focused=true]/day:z-1300 mtw:group-data-[focused=true]/day:ring-[3px] mtw:data-[range-end=true]:rounded-md mtw:data-[range-end=true]:rounded-r-md mtw:data-[range-middle=true]:rounded-none mtw:data-[range-start=true]:rounded-md mtw:data-[range-start=true]:rounded-l-md mtw:[&>span]:text-xs mtw:[&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
