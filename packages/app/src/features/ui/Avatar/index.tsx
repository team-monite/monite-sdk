import AntAvatar, { AvatarProps as AntAvatarProps } from 'antd/es/avatar';

type AvatarProps = AntAvatarProps & {};
const Avatar = ({ children, ...rest }: AvatarProps) => {
  return <AntAvatar {...rest}>{children}</AntAvatar>;
};

export default Avatar;
