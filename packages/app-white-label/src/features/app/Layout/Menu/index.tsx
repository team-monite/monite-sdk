import React from 'react';

import MenuItem from './MenuItem';

import { navigationData } from 'features/app/Layout/Menu/consts';

import * as Styled from './styles';

const Menu = () => {
  return (
    <Styled.Menu>
      {Object.values(navigationData).map((item) => (
        <MenuItem key={item.url} item={item} />
      ))}
    </Styled.Menu>
  );
};

export default Menu;
