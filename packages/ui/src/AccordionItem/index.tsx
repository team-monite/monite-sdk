import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{
  $isExpanded?: boolean;
  $isButton?: boolean;
}>`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
  }

  ${({ onClick, theme }) =>
    onClick
      ? `
  cursor: pointer;
  `
      : ''}

  ${({ onClick, theme, $isExpanded, $isButton }) =>
    onClick && !$isExpanded && !$isButton
      ? `
  &:hover {
    background: ${theme.colors.lightGrey3}
  }
  `
      : ''}

  ${({ theme, $isButton }) =>
    $isButton
      ? `
  color: ${theme.colors.blue};

  &:hover {
    background: ${theme.colors.black};
    color: ${theme.colors.white};
  }
  `
      : ''}

  ${({ $isButton }) =>
    $isButton
      ? `
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
      `
      : ''}
`;

const Header = styled.div``;

export type AccordionItemProps = {
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  isExpanded?: boolean;
  isInitiallyExpanded?: boolean;
  isButton?: boolean;
  onClickTitle?: () => void;
  onClickItem?: () => void;
  onClick?: () => void;
};

const AccordionItem = ({
  title,
  content,
  isExpanded,
  isButton,
  onClickTitle,
  onClickItem,
}: AccordionItemProps) => {
  return (
    <Wrapper
      onClick={onClickItem}
      $isExpanded={isExpanded}
      $isButton={isButton}
    >
      {!isExpanded ? <Header onClick={onClickTitle}>{title}</Header> : null}
      {isExpanded ? <div>{content}</div> : null}
    </Wrapper>
  );
};

export default AccordionItem;
