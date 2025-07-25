import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { cn } from '@/ui/lib/utils';

import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'mtw:bg-popover mtw:text-popover-foreground mtw:flex mtw:h-full mtw:w-full mtw:flex-col mtw:overflow-hidden mtw:rounded-md',
        className
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="mtw:sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('mtw:overflow-hidden mtw:p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command className="mtw:[&_[cmdk-group-heading]]:text-muted-foreground mtw:**:data-[slot=command-input-wrapper]:h-12 mtw:[&_[cmdk-group-heading]]:px-2 mtw:[&_[cmdk-group-heading]]:font-medium mtw:[&_[cmdk-group]]:px-2 mtw:[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 mtw:[&_[cmdk-input-wrapper]_svg]:h-5 mtw:[&_[cmdk-input-wrapper]_svg]:w-5 mtw:[&_[cmdk-input]]:h-12 mtw:[&_[cmdk-item]]:px-2 mtw:[&_[cmdk-item]]:py-3 mtw:[&_[cmdk-item]_svg]:h-5 mtw:[&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="mtw:flex mtw:h-9 mtw:items-center mtw:gap-2 mtw:border-b mtw:px-3"
    >
      <SearchIcon className="mtw:size-4 mtw:shrink-0 mtw:opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'mtw:placeholder:text-muted-foreground mtw:flex mtw:h-10 mtw:w-full mtw:rounded-md mtw:bg-transparent mtw:py-3 mtw:text-sm mtw:outline-hidden mtw:disabled:cursor-not-allowed mtw:disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'mtw:max-h-[300px] mtw:scroll-py-1 mtw:overflow-x-hidden mtw:overflow-y-auto',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="mtw:py-6 mtw:text-center mtw:text-sm"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'mtw:text-foreground mtw:[&_[cmdk-group-heading]]:text-muted-foreground mtw:overflow-hidden mtw:p-1 mtw:[&_[cmdk-group-heading]]:px-2 mtw:[&_[cmdk-group-heading]]:py-1.5 mtw:[&_[cmdk-group-heading]]:text-xs mtw:[&_[cmdk-group-heading]]:font-medium',
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('mtw:bg-border mtw:-mx-1 mtw:h-px', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'mtw:data-[selected=true]:bg-accent mtw:data-[selected=true]:text-accent-foreground mtw:[&_svg:not([class*=text-])]:text-muted-foreground mtw:relative mtw:flex mtw:cursor-default mtw:items-center mtw:gap-2 mtw:rounded-sm mtw:px-2 mtw:py-1.5 mtw:text-sm mtw:outline-hidden mtw:select-none mtw:data-[disabled=true]:pointer-events-none mtw:data-[disabled=true]:opacity-50 mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'mtw:text-muted-foreground mtw:ml-auto mtw:text-xs mtw:tracking-widest',
        className
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
