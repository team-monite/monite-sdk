import AntCheckbox, {
  CheckboxProps as AntCheckboxProps,
} from 'antd/es/checkbox';

import styles from './styles.module.scss';

type CheckboxProps = AntCheckboxProps & {};
const Checkbox = ({ ...rest }: CheckboxProps) => {
  return <AntCheckbox className={styles.checkbox} {...rest} />;
};

export default Checkbox;
