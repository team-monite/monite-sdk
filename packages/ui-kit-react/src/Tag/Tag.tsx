import React from 'react';
import styled from '@emotion/styled';

export type TagColorType =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'success'
  | 'warning'
  | 'error'
  | 'special';

export interface TagProps {
  color?: TagColorType;
  children?: React.ReactNode;
  avatar?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onClose?: () => void;
}

const StyledTag = styled.span<
  TagProps & {
    $color?: TagColorType;
    $isClickable?: boolean;
  }
>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  color: ${({ theme, $color = 'primary' }) => theme.tag[`${$color}TextColor`]};

  border-radius: 4px;
  background-color: ${({ theme, $color = 'primary' }) =>
    theme.tag[`${$color}BackgroundColor`]};

  padding: 1px 8px;
  height: 24px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  white-space: nowrap;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
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
