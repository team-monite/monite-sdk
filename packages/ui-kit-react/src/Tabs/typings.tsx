import { FC } from 'react';

export interface ReactTabsFC<P = {}> extends FC<P> {
  tabsRole: 'Tabs' | 'TabList' | 'Tab' | 'TabPanel';
}
