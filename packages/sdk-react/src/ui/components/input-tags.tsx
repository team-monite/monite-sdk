import * as React from 'react';

import { Badge } from '@/ui/components/badge';
import { Button } from '@/ui/components/button';
import { cn } from '@/ui/lib/utils';

import { XIcon } from 'lucide-react';

type InputTagsProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange'
> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState('');

    React.useEffect(() => {
      if (pendingDataPoint.includes(',')) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(',').map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    };

    return (
      <div
        className={cn(
          // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
          'mtw:has-[:focus-visible]:mtw:outline-none mtw:has-[:focus-visible]:mtw:ring-2 mtw:has-[:focus-visible]:mtw:ring-neutral-950 mtw:has-[:focus-visible]:mtw:ring-offset-2 dark:mtw:has-[:focus-visible]:mtw:ring-neutral-300 mtw:min-h-10 mtw:flex mtw:w-full mtw:flex-wrap mtw:gap-2 mtw:rounded-md mtw:border mtw:border-neutral-200 mtw:bg-white mtw:px-3 mtw:py-2 mtw:text-sm mtw:ring-offset-white mtw:disabled:mtw:cursor-not-allowed mtw:disabled:mtw:opacity-50 dark:mtw:border-neutral-800 dark:mtw:bg-neutral-950 dark:mtw:ring-offset-neutral-950',
          className
        )}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="mtw:ml-2 mtw:h-3 mtw:w-3"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="mtw:w-3" />
            </Button>
          </Badge>
        ))}
        <input
          className="mtw:flex-1 mtw:outline-none mtw:placeholder:mtw:text-neutral-500 dark:mtw:placeholder:mtw:text-neutral-400"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === 'Backspace' &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

InputTags.displayName = 'InputTags';

export { InputTags };
