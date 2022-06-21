import React from 'react';
import styled from '@emotion/styled';

import { Button, Text, TextProps } from '..';
import Modal, { ModalProps } from '.';

const Header = styled.div`
  padding: 32px 32px 0 32px;
  text-align: center;

  > * + * {
    margin-top: 16px;
  }
`;

const Content = styled.div`
  padding: 32px 32px 24px 32px;
`;

const Separator = styled.div`
  margin: 24px 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.lightGrey2};
`;

const Actions = styled.div<{ isSingleButton: boolean }>`
  padding: 0 24px 24px 24px;
  display: flex;
  justify-content: ${({ isSingleButton }) =>
    isSingleButton ? 'center' : 'space-between'};

  button {
    min-width: 116px;
  }
`;

export type ModalDialogProps = {
  title: string;
  titleProps?: Partial<TextProps>;
  footerSeparator?: boolean;
  cancelButtonTitle?: string;
  confirmButtonTitle?: string;
  confirmButtonProps?: any;
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
} & ModalProps;
const ModalDialog = ({
  confirmButtonTitle,
  confirmButtonProps,
  cancelButtonTitle,
  children,
  onConfirm,
  onCancel,
  title,
  titleProps,
  footerSeparator = true,
  ...rest
}: ModalDialogProps) => {
  const isSingleButton = cancelButtonTitle !== undefined && !cancelButtonTitle;

  return (
    <Modal onClickBackdrop={onCancel} {...rest}>
      <Header>
        <Text size="h3" as="h3" {...titleProps}>
          {title}
        </Text>
      </Header>
      <Content>{children}</Content>
      {footerSeparator && <Separator />}
      <Actions isSingleButton={isSingleButton}>
        {isSingleButton ? null : (
          <Button
            color="secondary"
            text={cancelButtonTitle || 'Cancel'}
            onClick={onCancel}
          />
        )}
        <Button
          text={confirmButtonTitle || 'Confirm'}
          onClick={onConfirm}
          {...confirmButtonProps}
        />
      </Actions>
    </Modal>
  );
};

export default ModalDialog;
