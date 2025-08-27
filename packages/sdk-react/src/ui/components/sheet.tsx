import { cn } from '@/ui/lib/utils';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  container,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal> & {
  container?: Element;
}) {
  return (
    <SheetPrimitive.Portal
      data-slot="sheet-portal"
      {...props}
      container={container}
    />
  );
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:fixed mtw:inset-0 mtw:z-1300 mtw:bg-black/50',
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  container = document.body,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  container?: Element;
}) {
  return (
    <SheetPortal container={container}>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'mtw:bg-background mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:fixed mtw:z-1300 mtw:flex mtw:flex-col mtw:shadow-lg mtw:transition mtw:ease-in-out mtw:data-[state=closed]:duration-300 mtw:data-[state=open]:duration-500',
          side === 'right' &&
            'mtw:data-[state=closed]:slide-out-to-right mtw:data-[state=open]:slide-in-from-right mtw:inset-y-0 mtw:right-0 mtw:h-full mtw:w-3/4 mtw:sm:max-w-[600px]',
          side === 'left' &&
            'mtw:data-[state=closed]:slide-out-to-left mtw:data-[state=open]:slide-in-from-left mtw:inset-y-0 mtw:left-0 mtw:h-full mtw:w-3/4 mtw:sm:max-w-[600px]',
          side === 'top' &&
            'mtw:data-[state=closed]:slide-out-to-top mtw:data-[state=open]:slide-in-from-top mtw:inset-x-0 mtw:top-0 mtw:h-auto mtw:border-b',
          side === 'bottom' &&
            'mtw:data-[state=closed]:slide-out-to-bottom mtw:data-[state=open]:slide-in-from-bottom mtw:inset-x-0 mtw:bottom-0 mtw:h-auto mtw:border-t',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="mtw:p-2 mtw:ring-offset-background mtw:focus:ring-ring mtw:data-[state=open]:bg-secondary mtw:absolute mtw:top-7 mtw:right-7 mtw:rounded-xs mtw:opacity-70 mtw:transition-opacity mtw:hover:opacity-100 mtw:focus:ring-2 mtw:focus:ring-offset-2 mtw:focus:outline-hidden mtw:cursor-pointer mtw:disabled:pointer-events-none">
          <XIcon className="mtw:size-6" />
          <span className="mtw:sr-only">{t(i18n)`Close`}</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('mtw:flex mtw:flex-col mtw:gap-1.5 mtw:p-8', className)}
      {...props}
    />
  );
}

function SheetContentWrapper({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-content-wrapper"
      className={cn('mtw:overflow-y-scroll mtw:p-8', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'mtw:mt-auto mtw:flex mtw:flex-col mtw:gap-2 mtw:p-8',
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'mtw:text-foreground mtw:font-semibold mtw:text-2xl',
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('mtw:text-muted-foreground mtw:text-sm', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetContentWrapper,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
