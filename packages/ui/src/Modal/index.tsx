import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

type ModalSize = 'md' | 'sm';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 950;
  display: block;
  width: 100%;
  height: 100%;
  outline: 0;

  overflow-x: hidden;
  overflow-y: auto;

  padding-top: 40px;
  padding-bottom: 40px;
`;

const SIZE_MAP: Record<string, string> = {
  md: 'max-width: 600px;',
  sm: 'max-width: 464px;',
};
const getSize = ({ $size = 'sm' }: StyledModalProps) =>
  $size ? SIZE_MAP[$size] : '';
const Body = styled.div<StyledModalProps>`
  position: relative;
  width: auto;
  pointer-events: none;

  transform: none;
  display: flex;
  align-items: center;
  margin: 1.75rem auto;

  ${getSize}

  min-height: calc(100% - 3.5rem);
`;

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

  box-shadow: 0px 8px 12px 0px #1111111f;
  border-radius: 8px;

  ${({ $fixedHeight }) =>
    $fixedHeight ? 'max-height: calc(100vh - 80px - 3.5rem);' : ''}
`;

const Backdrop = styled.div`
  opacity: 0.85;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 940;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
`;

const Area = styled.div`
  overflow-y: scroll;
`;

const Footer = styled.div`
  padding: 24px;
  border-top: solid 1px ${({ theme }) => theme.colors.lightGrey2};
  display: flex;
  justify-content: center;
`;

const FooterButton = styled(Button)`
  padding-right: 36px;
  padding-left: 36px;
`;

type StyledModalProps = {
  $size?: string;
  $fixedHeight?: boolean;
};

export type ModalProps = {
  children: React.ReactNode;
  onClickBackdrop?: () => void;
  size?: ModalSize;
  fixedHeight?: boolean;
  className?: string;
};

const Modal = (props: ModalProps) => {
  const { onClickBackdrop, children, size, fixedHeight, className } = props;

  const onClickModalContent = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <Wrapper onClick={onClickBackdrop}>
        <Body $size={size} className={className}>
          <Content onClick={onClickModalContent} $fixedHeight={fixedHeight}>
            {fixedHeight ? (
              <>
                <Area>{children}</Area>
                <Footer>
                  <FooterButton text="Got it" onClick={onClickBackdrop} />
                </Footer>
              </>
            ) : (
              children
            )}
          </Content>
        </Body>
      </Wrapper>
      <Backdrop onClick={onClickBackdrop} />
    </>
  );
};

export default Modal;
