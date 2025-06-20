import { useFileById } from '@/core/queries/useFiles';
import { Avatar, AvatarProps } from '@mui/material';

interface UserAvatarProps extends AvatarProps {
  fileId?: string | null;
}

interface UserAvatarPictureProps extends AvatarProps {
  fileId: string;
}

export const UserAvatar = ({ alt, fileId, ...other }: UserAvatarProps) => {
  if (fileId) {
    return <UserAvatarPicture fileId={fileId} alt={alt} {...other} />;
  }

  return <Avatar alt={alt} {...other} />;
};

const UserAvatarPicture = ({
  alt,
  fileId,
  ...other
}: UserAvatarPictureProps) => {
  const { data } = useFileById(fileId);

  return <Avatar alt={alt} src={data?.url} {...other} />;
};
