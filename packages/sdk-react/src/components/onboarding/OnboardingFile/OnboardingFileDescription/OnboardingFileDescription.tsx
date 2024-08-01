import { List, ListItem } from '@mui/material';

type OnboardingFileUploaderProps = {
  descriptions: string[];
};

export const OnboardingFileDescription = ({
  descriptions,
}: OnboardingFileUploaderProps) => {
  return (
    <List sx={{ listStyleType: 'disc', pl: 4 }}>
      {descriptions.map((item) => (
        <ListItem sx={{ display: 'list-item', pl: 1 }} key={item}>
          {item}
        </ListItem>
      ))}
    </List>
  );
};
