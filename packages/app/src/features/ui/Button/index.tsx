import AntButton, { ButtonProps as AntButtonProps } from 'antd/es/button';

import styles from './styles.module.scss';

type ButtonProps = AntButtonProps & {};
const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <AntButton className={styles.btn} {...rest}>
      {children}
    </AntButton>
  );
};

export default Button;
