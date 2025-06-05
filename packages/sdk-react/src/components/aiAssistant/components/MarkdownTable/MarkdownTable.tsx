import { Children, FC, isValidElement, ReactElement, ReactNode } from 'react';

import { SortableTable } from '@/components/aiAssistant/components/SortableTable/SortableTable';

interface MarkdownTableProps {
  children?: ReactNode;
}

export const MarkdownTable: FC<MarkdownTableProps> = ({ children }) => {
  const arrayChildren = Children.toArray(children);
  const thead = arrayChildren.find(
    (child): child is ReactElement =>
      isValidElement(child) && child.type === 'thead'
  );
  const tbody = arrayChildren.find(
    (child): child is ReactElement =>
      isValidElement(child) && child.type === 'tbody'
  );

  if (!thead || !tbody) {
    return <table>{children}</table>;
  }

  return <SortableTable thead={thead} tbody={tbody} />;
};
