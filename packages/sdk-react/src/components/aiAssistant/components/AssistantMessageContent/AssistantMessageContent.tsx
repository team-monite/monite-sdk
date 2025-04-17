import React, { type FC, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { AIBarChart } from '@/components/aiAssistant/components/AIBarChart/AIBarChart';
import { cn } from '@/ui/lib/utils';

import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { Part } from '../../types';
import { AIPieChart } from '../AIPieChart/AIPieChart';

interface AssistantMessageContentProps {
  part: Part;
  isLast: boolean;
  isStreaming: boolean;
}

export const AssistantMessageContent: FC<AssistantMessageContentProps> = ({
  part,
  isLast,
  isStreaming,
}) => {
  const chartWrapperRef = useRef(null);

  const [width, setWidth] = useState(0);

  const { type, content } = part;

  useEffect(() => {
    if (!chartWrapperRef?.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(chartWrapperRef.current);

    return () => observer.disconnect();
  }, []);

  switch (type) {
    case 'text': {
      return (
        <div
          className={cn([
            'markdown',
            'mtw:flex mtw:flex-col mtw:gap-4',
            isLast &&
              isStreaming &&
              "mtw:after:inline-block mtw:after:h-2 mtw:after:w-2 mtw:after:content-['']",
            'mtw:after:ml-2 mtw:after:animate-ping mtw:after:rounded-full mtw:after:bg-primary-50',
            'mtw:[&_td]:p-2.5 mtw:[&_th]:p-2.5',
          ])}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    case 'chart': {
      const {
        data_points: data,
        chart_metric: metrics,
        chart_type: chartType,
      } = content;

      return (
        <div ref={chartWrapperRef} className="mtw:h-[300px] mtw:w-full">
          {chartType === 'bar' && (
            <AIBarChart data={data} metrics={metrics} parentWidth={width} />
          )}

          {chartType === 'pie' && (
            <AIPieChart data={data} parentWidth={width} />
          )}
        </div>
      );
    }

    default: {
      return null;
    }
  }
};
