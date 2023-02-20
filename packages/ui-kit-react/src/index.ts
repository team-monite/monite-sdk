import { tokenizedTheme as defaultTokenizedTheme } from './theme';
import { tokenizedTheme as niobiTokenizedTheme } from './theme/niobi';

export { palette } from './theme';

export { default as Button } from './Button';
export { default as IconButton } from './IconButton';
export { default as Spinner } from './Spinner';
export { default as FormField } from './FormField';
export { default as Input } from './Input';
export { default as PasswordInput } from './PasswordInput';
export { default as Tag, type TagColorType } from './Tag';
export { default as Text, type TextProps } from './Text';
export * from './Dropdown';
export { default as Card } from './Card/Card';
export { default as Radio } from './Radio';
export { default as Search } from './Search';
export { default as Select } from './Select';
export { default as Checkbox } from './Checkbox';
export { default as List } from './List';
export { default as ListItem } from './ListItem';
export * from './Modal';
export { default as Header } from './Header';
export { default as Multiselect } from './Multiselect';
export { default as Tooltip } from './Tooltip';
export { default as Accordion } from './Accordion';
export * from './Box';
export { Table, TableProps, HeadCellSort, TableFooter } from './Table';
export { Sidebar, SidebarLayout } from './Sidebar';
export { default as Loading } from './Loading';
export { default as FlexContainer } from './FlexContainer';
export { default as FlexTable } from './FlexTable';
export { default as Avatar } from './Avatar/Avatar';
export { default as AvatarInput } from './AvatarInput';
export { default as LabelText } from './LabelText';
export { default as Link } from './Link';
export { default as DatePicker } from './DatePicker';
export { Tabs, Tab, TabPanel, TabList } from './Tabs';
export { default as Alert } from './Alert';
export { default as FileViewer } from './FileViewer';
export { default as ThemeProvider } from './core/ThemeProvider';

export * from './globalStyles';
export * from './unicons';
export * from './types';
export * from './theme';
export * from './theme_deprecated';

// for theme demo, set theme by url query parameter
let currentTheme = defaultTokenizedTheme;

if (window && window.location.href) {
  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('theme') === 'niobi') {
    currentTheme = niobiTokenizedTheme;
  }
}

export const tokenizedTheme = currentTheme;
