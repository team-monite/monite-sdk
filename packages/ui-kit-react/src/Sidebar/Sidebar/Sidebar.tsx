import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  position: fixed;
  z-index: 930;
  top: 0;
  right: 0;
  height: 100vh;
  width: 80vw;
  max-width: 604px;
  background: white;
  box-shadow: -8px 0px 16px 0px #00000014;

  display: flex;
  flex-direction: column;
`;

const Backdrop = styled.div`
  opacity: 0.8;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 920;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.lightGrey3};
`;

type SidebarProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClickBackdrop?: () => void;
};
const Sidebar = ({ isOpen, onClickBackdrop, children }: SidebarProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  return createPortal(
    <>
      <Wrapper>{children}</Wrapper>
      <Backdrop onClick={onClickBackdrop} />
    </>,
    document.body
  );
};

export default Sidebar;
