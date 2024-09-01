import { UUserSquare } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/icons/UUserSquare';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { Chip, Skeleton } from '@mui/material';

interface UserProps {
  userId: string;
}

export const Role = ({ userId }: UserProps) => {
  const { api } = useMoniteContext();

  const { data: role, isLoading } = api.roles.getRolesId.useQuery({
    path: { role_id: userId },
  });

  if (!role) {
    return null;
  }

  return (
    <>
      <Chip
        avatar={<UUserSquare width={18} />}
        label={
          isLoading ? (
            <Skeleton height="50%" width={100} animation="wave" />
          ) : (
            `"${role.name}"`
          )
        }
      />
    </>
  );
};
