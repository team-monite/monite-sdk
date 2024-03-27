import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getNavigationData } from '@/components/Menu/consts';
import { useLingui } from '@lingui/react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';

export const Menu = () => {
  const { i18n } = useLingui();
  const navigate = useNavigate();

  const navigationData = getNavigationData(i18n);

  const [openedItem, setOpenedItem] = useState<
    keyof typeof navigationData | null
  >(null);

  const handleCollapse = (key: keyof typeof navigationData) => {
    setOpenedItem(key === openedItem ? null : key);
  };

  return (
    <List>
      {Object.keys(navigationData).map((key) => {
        const item = navigationData[key];

        return (
          <Fragment key={item.url}>
            <ListItemButton
              onClick={() =>
                item.children ? handleCollapse(key) : navigate(item.url)
              }
            >
              <ListItemIcon>
                {item.renderIcon({ color: 'primary' })}
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {item.children &&
                (openedItem === key ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            <Collapse in={openedItem === key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children &&
                  Object.values(item.children).map((subItem) => (
                    <ListItemButton
                      key={subItem.url}
                      sx={{ pl: 4 }}
                      onClick={() => navigate(subItem.url)}
                    >
                      <ListItemIcon>
                        {subItem.renderIcon({ color: 'primary' })}
                      </ListItemIcon>
                      <ListItemText primary={subItem.label} />
                    </ListItemButton>
                  ))}
              </List>
            </Collapse>
          </Fragment>
        );
      })}
    </List>
  );
};
