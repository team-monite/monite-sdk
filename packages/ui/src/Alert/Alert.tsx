import React, { BaseSyntheticEvent, FC, ReactNode } from 'react';
import styled from '@emotion/styled';
import { UClockThree, UCheck, UExclamationTriangle } from 'unicons';
import { THEMES } from '../consts';
import { STYLES as TEXT_STYLES } from '../Text';

type AlertColorValue = {
  background: string;
  color: string;
};

export type AlertVariant = 'info' | 'success' | 'error';

export const AlertColors: Record<AlertVariant, AlertColorValue> = {
  info: {
    background: THEMES.default.colors.alertInfo,
    color: THEMES.default.colors.primary,
  },
  success: {
    background: THEMES.default.colors.alertSuccess,
    color: THEMES.default.colors.successDarker,
  },
  error: {
    background: THEMES.default.colors.alertError,
    color: THEMES.default.colors.error,
  },
};

export const AlertIcons: Record<AlertVariant, ReactNode> = {
  info: <UClockThree size={20} />,
  success: <UCheck size={20} />,
  error: <UExclamationTriangle size={20} />,
};

export interface AlertProps {
  children: ReactNode;
  onClick?: (e: BaseSyntheticEvent) => void;
  variant?: AlertVariant;
  hasLeftIcon?: boolean;
  link?: ReactNode;
  action?: ReactNode;
}

type StyledAlertProps = {
  $variant: AlertVariant;
};

const StyledAlert = styled.div<StyledAlertProps>`
  border-radius: 8px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 17px;
  gap: 16px;
  background: ${({ $variant }) => $variant && AlertColors[$variant].background};
  color: ${({ $variant }) => $variant && AlertColors[$variant].color};
`;

const StyledText = styled.div<AlertProps>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  ${TEXT_STYLES['small']}
`;

const StyledIcon = styled.i`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const StyledLink = styled.div`
  flex-grow: 2;
`;

const Alert: FC<AlertProps> = ({
  children,
  variant = 'info',
  hasLeftIcon,
  link,
  action,
  ...props
}) => {
  return (
    <StyledAlert $variant={variant} {...props}>
      {hasLeftIcon && <StyledIcon>{AlertIcons[variant]}</StyledIcon>}
      <StyledText>{children}</StyledText>
      {link && <StyledLink>{link}</StyledLink>}
      {action}
    </StyledAlert>
  );
};

export default Alert;
