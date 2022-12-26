import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'Box';

type ModalLayoutSize = 'md' | 'sm';

export type ModalLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: React.ReactNode;
  size?: ModalLayoutSize;
  fullScreen?: boolean;
  fullHeight?: boolean;
  isDrawer?: boolean;
  scrollableContent?: boolean;
};

type StyledModalLayoutProps = {
  $size?: ModalLayoutSize;
  $fullScreen?: boolean;
  $fullHeight?: boolean;
  $isDrawer?: boolean;
  $scrollableContent?: boolean;
};

const SIZE_MAP: Record<ModalLayoutSize, string> = {
  md: 'width: 600px;',
  sm: 'width: 464px;',
};

const getWidth = ({ $size = 'sm', $fullScreen }: StyledModalLayoutProps) => {
  if ($fullScreen) return 'width: 100%;';
  if ($size) return SIZE_MAP[$size];
  return '';
};

const getHeight = ({
  $fullScreen,
  $isDrawer,
  $fullHeight,
}: StyledModalLayoutProps) => {
  if ($fullScreen || $isDrawer || $fullHeight) return 'height: 100%;';

  return '';
};

const getMaxHeight = ({ $fullScreen, $isDrawer }: StyledModalLayoutProps) => {
  if ($fullScreen || $isDrawer) return '';

  return 'max-height: calc(100% - 64px);';
};

const getMargin = ({ $fullScreen, $isDrawer }: StyledModalLayoutProps) => {
  if ($fullScreen || $isDrawer) return '';

  return 'margin: 40px;';
};

const getBoxStyles = ({ $fullScreen, $isDrawer }: StyledModalLayoutProps) => {
  if ($fullScreen || $isDrawer) return '';

  return `
    box-shadow: 0 8px 12px 0 #1111111f;
    border-radius: 8px;
    overflow: hidden;
  `;
};

const StyledWrap = styled(Box)<StyledModalLayoutProps>`
  background-color: ${({ theme }) => theme.white};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: right;

  ${getWidth}
  ${getHeight}
  ${getMaxHeight}
  ${getMargin}
  ${getBoxStyles}
`;

const StyledModalLayoutContent = styled.div<StyledModalLayoutProps>`
  width: 100%;
  pointer-events: auto;
  outline: 0;
  flex-grow: 1;
  overflow: hidden;
  ${({ $scrollableContent }) =>
    $scrollableContent ? 'position: relative;' : ''}
`;

const StyledModalLayoutHeader = styled.div`
  flex: 0 0 auto;
`;

const StyledModalLayoutFooter = styled.div`
  flex: 0 0 auto;
`;

export const StyledModalLayoutScroll = styled(Box)`
  overflow: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const StyledModalLayoutScrollContent = styled(Box)`
  height: 100%;
  position: relative;
`;

const ModalLayout = ({
  children,
  header,
  footer,
  loading,
  size,
  fullScreen,
  fullHeight,
  isDrawer,
  scrollableContent,
}: ModalLayoutProps) => {
  return (
    <StyledWrap
      $size={size}
      $fullScreen={fullScreen}
      $fullHeight={fullHeight}
      $isDrawer={isDrawer}
      $scrollableContent={scrollableContent}
    >
      {header && <StyledModalLayoutHeader>{header}</StyledModalLayoutHeader>}
      <StyledModalLayoutContent $scrollableContent={scrollableContent}>
        {scrollableContent ? (
          <StyledModalLayoutScroll>
            <StyledModalLayoutScrollContent>
              {children}
            </StyledModalLayoutScrollContent>
          </StyledModalLayoutScroll>
        ) : (
          children
        )}
        {loading}
      </StyledModalLayoutContent>
      {footer && <StyledModalLayoutFooter>{footer}</StyledModalLayoutFooter>}
    </StyledWrap>
  );
};

export default ModalLayout;
