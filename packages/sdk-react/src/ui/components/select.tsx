import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'mtw:border-input mtw:data-[placeholder]:text-muted-foreground mtw:[&_svg:not([class*=text-])]:text-muted-foreground mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive mtw:dark:bg-input/30 mtw:dark:hover:bg-input/50 mtw:flex mtw:w-fit mtw:items-center mtw:justify-between mtw:gap-2 mtw:rounded-md mtw:border mtw:bg-transparent mtw:px-3 mtw:py-2 mtw:text-sm mtw:whitespace-nowrap mtw:shadow-xs mtw:transition-[color,box-shadow] mtw:outline-none mtw:focus-visible:ring-[3px] mtw:disabled:cursor-not-allowed mtw:disabled:opacity-50 mtw:data-[size=default]:h-9 mtw:data-[size=sm]:h-8 mtw:*:data-[slot=select-value]:line-clamp-1 mtw:*:data-[slot=select-value]:flex mtw:*:data-[slot=select-value]:items-center mtw:*:data-[slot=select-value]:gap-2 mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="mtw:size-4 mtw:opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'mtw:bg-popover mtw:text-popover-foreground mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:data-[state=closed]:zoom-out-95 mtw:data-[state=open]:zoom-in-95 mtw:data-[side=bottom]:slide-in-from-top-2 mtw:data-[side=left]:slide-in-from-right-2 mtw:data-[side=right]:slide-in-from-left-2 mtw:data-[side=top]:slide-in-from-bottom-2 mtw:relative mtw:z-1300 mtw:max-h-(--radix-select-content-available-height) mtw:min-w-[8rem] mtw:origin-(--radix-select-content-transform-origin) mtw:overflow-x-hidden mtw:overflow-y-auto mtw:rounded-md mtw:border-none mtw:shadow-md',
          position === 'popper' &&
            'mtw:data-[side=bottom]:translate-y-1 mtw:data-[side=left]:-translate-x-1 mtw:data-[side=right]:translate-x-1 mtw:data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'mtw:p-1',
            position === 'popper' &&
              'mtw:h-[var(--radix-select-trigger-height)] mtw:w-full mtw:min-w-[var(--radix-select-trigger-width)] mtw:scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'mtw:text-muted-foreground mtw:px-2 mtw:py-1.5 mtw:text-xs',
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'mtw:focus:bg-accent mtw:focus:text-accent-foreground mtw:[&_svg:not([class*=text-])]:text-muted-foreground mtw:relative mtw:flex mtw:w-full mtw:cursor-default mtw:items-center mtw:gap-2 mtw:rounded-sm mtw:py-1.5 mtw:pr-8 mtw:pl-2 mtw:text-sm mtw:outline-hidden mtw:select-none mtw:data-[disabled]:pointer-events-none mtw:data-[disabled]:opacity-50 mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4 mtw:*:[span]:last:flex mtw:*:[span]:last:items-center mtw:*:[span]:last:gap-2',
        className
      )}
      {...props}
    >
      <span className="mtw:absolute mtw:right-2 mtw:flex mtw:size-3.5 mtw:items-center mtw:justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="mtw:size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'mtw:bg-border mtw:pointer-events-none mtw:-mx-1 mtw:my-1 mtw:h-px',
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'mtw:flex mtw:cursor-default mtw:items-center mtw:justify-center mtw:py-1',
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="mtw:size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'mtw:flex mtw:cursor-default mtw:items-center mtw:justify-center mtw:py-1',
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="mtw:size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
