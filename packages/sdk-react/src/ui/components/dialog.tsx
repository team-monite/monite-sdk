import { cn } from '@/ui/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:fixed mtw:inset-0 mtw:z-1300 mtw:bg-black/50',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  fullScreen = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  fullScreen?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'mtw:bg-background mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:data-[state=closed]:zoom-out-95 mtw:data-[state=open]:zoom-in-95 mtw:fixed mtw:top-[50%] mtw:left-[50%] mtw:z-1300 mtw:grid mtw:w-full mtw:max-w-[calc(100%-2rem)] mtw:translate-x-[-50%] mtw:translate-y-[-50%] mtw:gap-4 mtw:rounded-lg mtw:border mtw:p-6 mtw:shadow-lg mtw:duration-200 mtw:sm:max-w-lg',
          fullScreen &&
            'mtw:border-none mtw:rounded-none mtw:h-screen mtw:max-w-screen mtw:sm:max-w-screen',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="mtw:ring-offset-background mtw:focus:ring-ring mtw:data-[state=open]:bg-accent mtw:data-[state=open]:text-muted-foreground mtw:absolute mtw:top-4 mtw:right-4 mtw:rounded-xs mtw:opacity-70 mtw:transition-opacity mtw:hover:opacity-100 mtw:focus:ring-2 mtw:focus:ring-offset-2 mtw:focus:outline-hidden mtw:disabled:pointer-events-none mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4"
          >
            <XIcon />
            <span className="mtw:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'mtw:flex mtw:flex-col mtw:gap-2 mtw:text-center mtw:sm:text-left',
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'mtw:flex mtw:flex-col-reverse mtw:gap-2 mtw:sm:flex-row mtw:sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'mtw:text-lg mtw:leading-none mtw:font-semibold',
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('mtw:text-muted-foreground mtw:text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
