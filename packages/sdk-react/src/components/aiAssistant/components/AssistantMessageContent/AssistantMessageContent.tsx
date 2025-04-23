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
}

export const AssistantMessageContent: FC<AssistantMessageContentProps> = ({
  part,
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
        <div className={cn(['markdown', 'mtw:[&_td]:p-2.5 mtw:[&_th]:p-2.5'])}>
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
