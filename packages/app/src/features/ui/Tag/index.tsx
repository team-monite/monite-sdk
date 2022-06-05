import AntTag, { TagProps as AntTagProps } from 'antd/es/tag';

import styles from './styles.module.scss';

type TagProps = AntTagProps & {};
const Tag = ({ ...rest }: TagProps) => {
  return <AntTag className={styles.tag} {...rest} />;
};

export default Tag;
