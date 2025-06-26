import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'mtw:bg-popover mtw:text-popover-foreground mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:data-[state=closed]:zoom-out-95 mtw:data-[state=open]:zoom-in-95 mtw:data-[side=bottom]:slide-in-from-top-2 mtw:data-[side=left]:slide-in-from-right-2 mtw:data-[side=right]:slide-in-from-left-2 mtw:data-[side=top]:slide-in-from-bottom-2 mtw:z-50 mtw:max-h-(--radix-dropdown-menu-content-available-height) mtw:min-w-[8rem] mtw:origin-(--radix-dropdown-menu-content-transform-origin) mtw:overflow-x-hidden mtw:overflow-y-auto mtw:rounded-md mtw:border-none mtw:p-1 mtw:shadow-md',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'mtw:focus:bg-accent mtw:focus:text-accent-foreground mtw:data-[variant=destructive]:text-destructive mtw:data-[variant=destructive]:focus:bg-destructive/10 mtw:dark:data-[variant=destructive]:focus:bg-destructive/20 mtw:data-[variant=destructive]:focus:text-destructive mtw:data-[variant=destructive]:*:[svg]:!text-destructive mtw:[&_svg:not([class*=text-])]:text-muted-foreground mtw:relative mtw:flex mtw:cursor-pointer mtw:items-center mtw:gap-2 mtw:rounded-sm mtw:px-2 mtw:py-1.5 mtw:text-sm mtw:outline-hidden mtw:select-none mtw:data-[disabled]:pointer-events-none mtw:data-[disabled]:opacity-50 mtw:data-[inset]:pl-8 mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        'mtw:focus:bg-accent mtw:focus:text-accent-foreground mtw:relative mtw:flex mtw:cursor-default mtw:items-center mtw:gap-2 mtw:rounded-sm mtw:py-1.5 mtw:pr-2 mtw:pl-8 mtw:text-sm mtw:outline-hidden mtw:select-none mtw:data-[disabled]:pointer-events-none mtw:data-[disabled]:opacity-50 mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="mtw:pointer-events-none mtw:absolute mtw:left-2 mtw:flex mtw:size-3.5 mtw:items-center mtw:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="mtw:size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'mtw:focus:bg-accent mtw:focus:text-accent-foreground mtw:relative mtw:flex mtw:cursor-default mtw:items-center mtw:gap-2 mtw:rounded-sm mtw:py-1.5 mtw:pr-2 mtw:pl-8 mtw:text-sm mtw:outline-hidden mtw:select-none mtw:data-[disabled]:pointer-events-none mtw:data-[disabled]:opacity-50 mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <span className="mtw:pointer-events-none mtw:absolute mtw:left-2 mtw:flex mtw:size-3.5 mtw:items-center mtw:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="mtw:size-2 mtw:fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'mtw:px-2 mtw:py-1.5 mtw:text-sm mtw:font-medium mtw:data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('mtw:bg-border mtw:-mx-1 mtw:my-1 mtw:h-px', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'mtw:text-muted-foreground mtw:ml-auto mtw:text-xs mtw:tracking-widest',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'mtw:focus:bg-accent mtw:focus:text-accent-foreground mtw:data-[state=open]:bg-accent mtw:data-[state=open]:text-accent-foreground mtw:flex mtw:cursor-default mtw:items-center mtw:rounded-sm mtw:px-2 mtw:py-1.5 mtw:text-sm mtw:outline-hidden mtw:select-none mtw:data-[inset]:pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="mtw:ml-auto mtw:size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'mtw:bg-popover mtw:text-popover-foreground mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:data-[state=closed]:zoom-out-95 mtw:data-[state=open]:zoom-in-95 mtw:data-[side=bottom]:slide-in-from-top-2 mtw:data-[side=left]:slide-in-from-right-2 mtw:data-[side=right]:slide-in-from-left-2 mtw:data-[side=top]:slide-in-from-bottom-2 mtw:z-50 mtw:min-w-[8rem] mtw:origin-(--radix-dropdown-menu-content-transform-origin) mtw:overflow-hidden mtw:rounded-md mtw:border mtw:p-1 mtw:shadow-lg',
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
