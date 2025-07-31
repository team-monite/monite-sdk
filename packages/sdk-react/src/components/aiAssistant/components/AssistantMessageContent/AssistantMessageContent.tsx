import { Part } from '../../types';
import { AIPieChart } from '../AIPieChart/AIPieChart';
import { AIBarChart } from '@/components/aiAssistant/components/AIBarChart/AIBarChart';
import { MarkdownTable } from '@/components/aiAssistant/components/MarkdownTable/MarkdownTable';
import { fixMarkdownListIndentation } from '@/components/aiAssistant/utils/aiAssistant';
import { cn } from '@/ui/lib/utils';
import React, { type FC, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

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
      const text = fixMarkdownListIndentation(content);

      return (
        <div className={cn(['markdown', 'mtw:[&_td]:p-2.5 mtw:[&_th]:p-2.5'])}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              table: ({ node, ...props }) => <MarkdownTable {...props} />,
            }}
          >
            {text}
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
        <div
          ref={chartWrapperRef}
          className="mtw:h-[350px] mtw:w-full mtw:mt-3 overflow-hidden"
        >
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
