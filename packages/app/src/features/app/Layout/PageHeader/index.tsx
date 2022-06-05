import {
  PageHeader as AntPageHeader,
  PageHeaderProps as AntPageHeaderProps,
} from 'antd';

import styles from './styles.module.scss';

type PageHeaderProps = {
  title: string;
} & AntPageHeaderProps;
const PageHeader = ({ title, ...rest }: PageHeaderProps) => {
  return (
    <AntPageHeader
      className={styles.header}
      title={<h1>{title}</h1>}
      {...rest}
    />
  );
};

export default PageHeader;
