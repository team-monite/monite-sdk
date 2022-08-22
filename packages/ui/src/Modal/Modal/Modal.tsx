import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { Flex } from '../../Box';

export type ModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
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

const StyledModal = styled(Flex)`
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

const ModalLayout = ({ onClose, children, className }: ModalProps) => {
  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden');
    return () => {
      document.body.style.removeProperty('overflow');
    };
  });

  return createPortal(
    <>
      <StyledBackdrop onClick={onClose} />
      <StyledModal className={className}>{children}</StyledModal>
    </>,
    document.body
  );
};

export default ModalLayout;
