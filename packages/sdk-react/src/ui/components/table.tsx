import { cn } from '@/ui/lib/utils';
import type { ComponentProps } from 'react';

function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="mtw:relative mtw:w-full mtw:overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn('mtw:w-full mtw:caption-bottom mtw:text-sm', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('mtw:[&_tr]:border-b', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('mtw:[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'mtw:bg-muted/50 mtw:border-t mtw:font-medium mtw:[&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'mtw:hover:bg-muted/50 mtw:data-[state=selected]:bg-muted mtw:border-b mtw:transition-colors',
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'mtw:text-foreground mtw:h-10 mtw:px-2 mtw:text-left mtw:align-middle mtw:font-medium mtw:whitespace-nowrap mtw:[&:has([role=checkbox])]:pr-0 mtw:[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'mtw:p-2 mtw:align-middle mtw:whitespace-nowrap mtw:[&:has([role=checkbox])]:pr-0 mtw:[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        'mtw:text-muted-foreground mtw:mt-4 mtw:text-sm',
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
