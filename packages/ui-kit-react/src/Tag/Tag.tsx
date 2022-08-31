import React from 'react';
import styled from '@emotion/styled';

import { THEMES } from '../consts';

export type TagColorType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'pending'
  | 'disabled'
  | 'secondary'
  | 'draft';

export interface TagProps {
  color?: TagColorType;
  children?: React.ReactNode;
  avatar?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onClose?: () => void;
}

const Themes: Record<TagColorType, string> = {
  primary: '',
  success: `
    color: ${THEMES.default.colors.tagGreen};
    background: ${THEMES.default.colors.tagSalad};
    border-color: ${THEMES.default.colors.tagSalad}
  `,
  warning: `
    color: ${THEMES.default.colors.orange};
    background: ${THEMES.default.colors.tagBeige};
    border-color: ${THEMES.default.colors.tagBeige}
  `,
  pending: `
    color: ${THEMES.default.colors.tagViolet};
    background: ${THEMES.default.colors.tagPink};
    border-color: ${THEMES.default.colors.tagPink}
  `,
  disabled: `
    color: ${THEMES.default.colors.grey};
  `,
  secondary: `
    background: ${THEMES.default.colors.lightGrey3};
    border-color: ${THEMES.default.colors.lightGrey3};
  `,
  draft: `
    background: ${THEMES.default.colors.lightGrey3};
    border-color: ${THEMES.default.colors.lightGrey3};
    color: ${THEMES.default.colors.grey};
  `,
};

const StyledTag = styled.span<
  TagProps & {
    $color?: TagColorType;
    $isClickable?: boolean;
  }
>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.black};

  border: 1px solid ${({ theme }) => theme.colors.lightGrey2};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};

  padding: 1px 8px;
  height: 24px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  white-space: nowrap;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};

  ${({ $color = 'primary' }) => Themes[$color]}
`;

const StyledIcon = styled.i<{
  $hasRightIcon?: boolean;
  $hasLeftIcon?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ $hasLeftIcon, $hasRightIcon }) => {
    if ($hasLeftIcon) return `margin-right: 8px;`;
    if ($hasRightIcon) return `margin-left: 8px;`;
  }}
`;

const StyledAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 8px;

  div {
    width: 16px;
    height: 16px;
    font-size: 9px;
  }
`;

const Tag: React.FC<TagProps> = ({
  children,
  leftIcon,
  rightIcon,
  avatar,
  color,
  onClose,
  ...props
}: TagProps) => {
  return (
    <StyledTag
      onClick={onClose}
      $isClickable={!!onClose}
      $color={color}
      {...props}
    >
      {avatar && <StyledAvatar>{avatar}</StyledAvatar>}
      {leftIcon && <StyledIcon $hasLeftIcon>{leftIcon}</StyledIcon>}
      {children && <span>{children}</span>}
      {rightIcon && <StyledIcon $hasRightIcon>{rightIcon}</StyledIcon>}
    </StyledTag>
  );
};

export default Tag;
