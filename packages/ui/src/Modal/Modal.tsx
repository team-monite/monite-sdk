import React, { useEffect } from 'react';
import styled from '@emotion/styled';

type ModalSize = 'md' | 'sm';

type StyledModalProps = {
  $size?: ModalSize;
  $fullScreen?: boolean;
};

export type ModalProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  size?: ModalSize;
  fullScreen?: boolean;
  className?: string;
};

const SIZE_MAP: Record<ModalSize, string> = {
  md: 'width: 600px;',
  sm: 'width: 464px;',
};

const StyledBackdrop = styled.div`
  opacity: 0.85;
  position: fixed;
  z-index: 940;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
`;

const StyledModal = styled.div<StyledModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 950;
`;

const getWidth = ({ $size = 'sm', $fullScreen }: StyledModalProps) => {
  if ($fullScreen) return 'width: 100%;';
  if ($size) return SIZE_MAP[$size];
  return '';
};

const getHeight = ({ $fullScreen }: StyledModalProps) => {
  if ($fullScreen) return 'height: 100%;';

  return 'max-height: calc(100% - 64px);';
};

const getMargin = ({ $fullScreen }: StyledModalProps) => {
  if ($fullScreen) return '';

  return 'margin: 40px;';
};

const getBoxStyles = ({ $fullScreen }: StyledModalProps) => {
  if ($fullScreen) return '';

  return `
    box-shadow: 0 8px 12px 0 #1111111f;
    border-radius: 8px;
  `;
};

const StyledWrap = styled.div<StyledModalProps>`
  background-color: ${({ theme }) => theme.colors.white};
  position: relative;
  display: flex;
  flex-direction: column;

  ${getWidth}
  ${getHeight}
  ${getMargin}
  ${getBoxStyles}
`;

const StyledModalContent = styled.div<StyledModalProps>`
  overflow-y: auto;
  width: 100%;
  pointer-events: auto;
  outline: 0;
`;

const StyledModalHeader = styled.div<StyledModalProps>`
  flex: 0 0 auto;
`;

const StyledModalFooter = styled.div<StyledModalProps>`
  flex: 0 0 auto;
`;

const StyledModalScroll = styled.div<StyledModalProps>`
  width: 100%;
`;

const Modal = ({
  onClose,
  children,
  size,
  className,
  fullScreen,
  header,
  footer,
}: ModalProps) => {
  const onWrapClick = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden');
    return () => {
      document.body.style.removeProperty('overflow');
    };
  });

  return (
    <>
      <StyledBackdrop onClick={onClose} />
      <StyledModal className={className} onClick={onClose}>
        <StyledWrap onClick={onWrapClick} $size={size} $fullScreen={fullScreen}>
          {header && <StyledModalHeader>{header}</StyledModalHeader>}
          <StyledModalContent>
            <StyledModalScroll>{children}</StyledModalScroll>
          </StyledModalContent>
          {footer && <StyledModalFooter>{footer}</StyledModalFooter>}
        </StyledWrap>
      </StyledModal>
    </>
  );
};

export default Modal;
