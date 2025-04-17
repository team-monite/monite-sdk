import React, { type FC } from 'react';

import { cn } from '@/ui/lib/utils';

import type { Props } from 'recharts/types/component/DefaultLegendContent';

export const ChartLegend: FC<Props> = ({ payload }) => (
  <div className="mtw:flex mtw:flex-col mtw:justify-start mtw:gap-4">
    {!!payload?.length &&
      payload.map(({ color, value, payload }, index) => (
        <div
          key={`item-${index}`}
          className={cn(
            'mtw:flex mtw:items-center mtw:justify-between mtw:rounded mtw:px-2 mtw:py-0.5',
            'mtw:border mtw:border-gray-200 mtw:border-solid mtw:shadow-md'
          )}
        >
          <div className="mtw:flex mtw:items-center  mtw:gap-2 mtw:overflow-hidden">
            <span
              style={{ background: color }}
              className="mtw:w-2 mtw:h-2 mtw:rounded-[2px] mtw:inline-block mtw:shrink-0 "
            />

            <span
              className={cn(
                'mtw:mx-2 mtw:text-gray-700 mtw:inline-block',
                'mtw:text-xs mtw:md:text-sm mtw:truncate'
              )}
            >
              {value}
            </span>
          </div>

          {payload && <span>{payload.value}</span>}
        </div>
      ))}
  </div>
);
