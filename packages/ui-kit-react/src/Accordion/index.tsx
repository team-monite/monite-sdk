import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import AccordionItem, { AccordionItemProps } from '../AccordionItem';

const Wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.neutral80};

  > * + * {
    border-top: 1px solid ${({ theme }) => theme.neutral80};
  }

  div:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

type AccordionProps = {
  items: AccordionItemProps[];
  defaultExpandedIndex?: number;
  className?: string;
  onToggle?: (index: number) => void;
};

const Accordion = ({
  items,
  defaultExpandedIndex,
  className,
  onToggle,
}: AccordionProps) => {
  const [expanded, setExpanded] = useState<number>(-1);

  useEffect(() => {
    setExpanded(-1);
  }, [items.length]);

  useEffect(() => {
    if (defaultExpandedIndex && defaultExpandedIndex !== -1) {
      setExpanded(defaultExpandedIndex);
    }
  }, [defaultExpandedIndex]);

  const onClickItem = (index: number) => {
    setExpanded(index === expanded ? -1 : index);

    if (onToggle) {
      onToggle(index);
    }
  };

  return (
    <Wrapper className={className}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isExpanded={expanded === index}
          onClickItem={
            item.content && item.title ? () => onClickItem(index) : item.onClick
          }
          isButton={!!item.onClick}
        />
      ))}
    </Wrapper>
  );
};

export default Accordion;
