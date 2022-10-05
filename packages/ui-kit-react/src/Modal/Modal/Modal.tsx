import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { Flex } from '../../Box';

export type ModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  anchor?: 'left' | 'right' | 'center';
};

type StyledModalProps = {
  $anchor: ModalProps['anchor'];
};

const StyledBackdrop = styled.div`
  opacity: 0.85;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(17, 17, 17, 0.25);
`;

const StyledModal = styled(Flex)<StyledModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ $anchor }) => $anchor};
`;

const ModalLayout = ({
  onClose,
  children,
  className,
  anchor = 'center',
}: ModalProps) => {
  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden');
    return () => {
      document.body.style.removeProperty('overflow');
    };
  });

  return createPortal(
    <>
      <StyledBackdrop onClick={onClose} />
      <StyledModal $anchor={anchor} className={className}>
        {children}
      </StyledModal>
    </>,
    document.body
  );
};

export default ModalLayout;
