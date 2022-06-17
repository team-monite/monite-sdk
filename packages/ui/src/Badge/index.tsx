import React from 'react';
import styled from 'styled-components';

import { THEMES } from '../consts';

const Themes: Record<string, any> = {
  primary: '',
  success: `
    color: ${THEMES.default.colors.green};
    background: ${THEMES.default.colors.salad};
    border-color: ${THEMES.default.colors.salad}
  `,
  warning: `
    color: ${THEMES.default.colors.orange};
    background: ${THEMES.default.colors.beige};
    border-color: ${THEMES.default.colors.beige}
  `,
  pending: `
    color: ${THEMES.default.colors.violet};
    background: ${THEMES.default.colors.pink};
    border-color: ${THEMES.default.colors.pink}
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

const StyledBadge = styled.span<
  BadgeProps & {
    hasRightIcon: boolean;
    hasLeftIcon: boolean;
    $color?: string;
  }
>`
  display: inline-block;
  color: ${THEMES.default.colors.black};

  border: 1px solid ${THEMES.default.colors.lightGrey2};
  border-radius: 4px;
  background: white;

  padding: 1px 8px;
  height: 24px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  white-space: nowrap;

  span {
    display: inline-block;

    ${({ hasLeftIcon }) => (hasLeftIcon ? 'margin-left: 8px;' : '')}
    ${({ hasRightIcon }) => (hasRightIcon ? 'margin-right: 8px;' : '')}
  }

  i {
    display: inline-block;
    vertical-align: middle;
    height: 18px;
  }

  svg {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  ${({ $color = 'primary' }) => Themes[$color]}
`;

export interface BadgeProps {
  color?: string;
  text?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  leftIcon,
  rightIcon,
  color,
  ...props
}: BadgeProps) => {
  return (
    <StyledBadge
      hasLeftIcon={!!leftIcon}
      hasRightIcon={!!rightIcon}
      $color={color}
      {...props}
    >
      {leftIcon ? <i>{leftIcon}</i> : null}
      {text ? <span>{text}</span> : null}
      {rightIcon ? <i>{rightIcon}</i> : null}
    </StyledBadge>
  );
};

export default Badge;
