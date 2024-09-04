import { useMoniteContext } from '../context/MoniteContext';

export const useMailboxes = () => {
  const { api } = useMoniteContext();

  return api.mailboxes.getMailboxes.useQuery();
};
