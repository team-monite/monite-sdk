import React, { ReactNode, useState } from 'react';

import { Collapse, List } from '@mui/material';

import { NavigationListItem } from '@/components/NavigationMenu/NavigationListItem';
import { IconAngleDown, IconAngleUp } from '@/icons';

type NavigationListCollapseProps = {
  children: ReactNode;
  icon: ReactNode;
  label: ReactNode;
};

export const NavigationListCollapse = ({
  children,
  icon,
  label,
}: NavigationListCollapseProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <NavigationListItem
        endIcon={collapsed ? <IconAngleUp /> : <IconAngleDown />}
        icon={icon}
        onClick={(event) => {
          event.preventDefault();
          setCollapsed(!collapsed);
        }}
      >
        {label}
      </NavigationListItem>
      <Collapse in={collapsed}>
        <List className="navigation-list">{children}</List>
      </Collapse>
    </>
  );
};
