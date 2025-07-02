import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'mtw:relative mtw:flex mtw:size-8 mtw:shrink-0 mtw:overflow-hidden mtw:rounded-full',
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('mtw:aspect-square mtw:size-full', className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'mtw:bg-muted mtw:flex mtw:size-full mtw:items-center mtw:justify-center mtw:rounded-full',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
