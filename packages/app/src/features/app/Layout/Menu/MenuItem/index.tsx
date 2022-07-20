import React, { useState } from 'react';
import styled from '@emotion/styled';
import { NavLink, NavLinkProps } from 'react-router-dom';

import { Text, UAngleDown } from '@monite/ui';
import { MenuItemType } from '../types';

type MenuItemProps = {
  item: MenuItemType;
};

interface MenuItemLInkProps extends NavLinkProps {
  hasChildren?: boolean;
}

const MenuItemLink = styled(NavLink)<MenuItemLInkProps>`
  display: flex;
  align-items: center;

  padding: 8px 12px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGrey2};
  }

  ${({ hasChildren, theme }) =>
    !hasChildren
      ? `
    &.active {
      background: ${theme.colors.lightGrey2};
    }
  `
      : ''}
`;

const MenuSubItemLink = styled(MenuItemLink)`
  padding-left: 40px;

  &.active {
    background: ${({ theme }) => theme.colors.lightGrey2};
  }
`;

const LinkText = styled(Text)`
  flex: 1 1 auto;
`;

const LinkIcon = styled.i`
  line-height: 0;
`;

const MenuItem = ({ item }: MenuItemProps) => {
  const { url, label, icon, children, onClick } = item;
  const [submenuIsShown, setSubmenuIsShown] = useState<boolean>(false);

  const handleOnClick = (e: React.BaseSyntheticEvent) => {
    if (onClick) {
      onClick(e);
    }

    if (children) setSubmenuIsShown((prev) => !prev);
  };

  return (
    <>
      <MenuItemLink
        to={url}
        onClick={handleOnClick}
        hasChildren={!!children?.length}
      >
        {({ isActive }) => {
          if (isActive) setSubmenuIsShown(true);

          return (
            <>
              <LinkIcon>{icon}</LinkIcon>
              <LinkText textSize="smallBold" ml="8px">
                {label}
              </LinkText>
              {children && (
                <LinkIcon>
                  <UAngleDown width={24} />
                </LinkIcon>
              )}
            </>
          );
        }}
      </MenuItemLink>
      {children &&
        submenuIsShown &&
        children.map((subItem) => (
          <MenuSubItemLink to={subItem.url} key={subItem.url}>
            <LinkIcon>{subItem.icon}</LinkIcon>
            <LinkText textSize="smallBold" ml="8px">
              {subItem.label}
            </LinkText>
          </MenuSubItemLink>
        ))}
    </>
  );
};

export default MenuItem;
