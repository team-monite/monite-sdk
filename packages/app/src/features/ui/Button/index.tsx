import AntButton, {
  ButtonProps as AntButtonProps,
} from 'antd/lib/button/index';

type ButtonProps = AntButtonProps & {};
const Button = ({ children, ...rest }: ButtonProps) => {
  return <AntButton {...rest}>{children}</AntButton>;
};

export default Button;
