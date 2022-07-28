import React from 'react';
import styled from '@emotion/styled';

type ModalSize = 'md' | 'sm';

type StyledModalProps = {
  $size?: ModalSize;
  $fixedHeight?: boolean;
  $fullScreen?: boolean;
};

export type ModalProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClickBackdrop?: () => void;
  size?: ModalSize;
  fixedHeight?: boolean;
  fullScreen?: boolean;
  className?: string;
};

const SIZE_MAP: Record<ModalSize, string> = {
  md: 'max-width: 600px;',
  sm: 'max-width: 464px;',
};

const getWidth = ({ $size = 'sm', $fullScreen }: StyledModalProps) => {
  if ($fullScreen) return 'width: 100%;';
  if ($size) return SIZE_MAP[$size];
  return '';
};

const Wrapper = styled.div<StyledModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;

  overflow-x: hidden;
  overflow-y: auto;

  ${({ $fullScreen }) =>
    !$fullScreen &&
    `
    padding-top: 40px;
    padding-bottom: 40px;
  `}
`;

// const Body = styled.div<StyledModalProps>`
//   position: relative;
//   width: ${({ $fullScreen }) => ($fullScreen ? '100%' : 'auto')};
//   pointer-events: none;
//
//   transform: none;
//   display: flex;
//   align-items: center;
//
//   ${({ $fullScreen }) =>
//     !$fullScreen &&
//     `
//       margin: 1.75rem auto;
//       min-height: calc(100% - 3.5rem);
//     `}
//
//   ${getWidth}
// `;

const Content = styled.div<StyledModalProps>`
  font-size: 16px;
  overflow: hidden;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;

  ${getWidth}

  ${({ $fullScreen }) =>
    !$fullScreen &&
    `
      box-shadow: 0 8px 12px 0 #1111111f;
      border-radius: 8px;
    `}

  ${({ $fixedHeight, $fullScreen }) =>
    $fixedHeight && !$fullScreen && 'max-height: calc(100vh - 80px - 3.5rem);'}
`;

const Backdrop = styled.div`
  opacity: 0.85;

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
`;

const Modal = ({
  onClickBackdrop,
  children,
  size,
  fixedHeight,
  className,
  fullScreen,
  header,
  footer,
}: ModalProps) => {
  return (
    <>
      <Backdrop onClick={onClickBackdrop} />
      <Wrapper $fullScreen={fullScreen} onClick={onClickBackdrop}>
        {header}
        <Content $fixedHeight={fixedHeight}>{children}</Content>
        {footer}
      </Wrapper>
    </>
  );
};

export default Modal;
