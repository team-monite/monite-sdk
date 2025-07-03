import { components } from '@/api';
import { UUserSquare } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/icons/UUserSquare';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip/PayableStatusChip';
import { UserDisplayCell } from '@/components/UserDisplayCell/UserDisplayCell';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Skeleton,
} from '@mui/material';

import { useResolvedApprovalStepsWithPolicy } from './useResolvedApprovalSteps';

interface RoleCellProps {
  roleId: string;
  designVariant?: 'old' | 'new';
  roleData?: components['schemas']['RoleResponse'];
}

const RoleCell = ({
  roleId,
  roleData,
  designVariant = 'old',
}: RoleCellProps) => {
  const { api } = useMoniteContext();

  const { data: role, isLoading } = api.roles.getRolesId.useQuery(
    {
      path: { role_id: roleId },
    },
    {
      enabled: !roleData,
    }
  );

  const displayRole = roleData ?? role;
  const isRoleLoading = !roleData && isLoading;

  if (!displayRole) {
    return null;
  }

  if (designVariant === 'new') {
    return (
      <Chip
        label={
          isRoleLoading ? (
            <Skeleton height="50%" width={100} animation="wave" />
          ) : (
            displayRole.name
          )
        }
        title={isRoleLoading ? '' : displayRole.name}
        variant="filled"
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          backgroundColor: '#f5f5f5',
          color: '#333',
          '& .MuiChip-label': {
            px: 2,
            py: 0.5,
          },
        }}
      />
    );
  }

  return (
    <Chip
      avatar={<UUserSquare width={18} />}
      label={
        isRoleLoading ? (
          <Skeleton height="50%" width={100} animation="wave" />
        ) : (
          displayRole.name
        )
      }
      title={isRoleLoading ? '' : displayRole.name}
      variant="outlined"
      sx={{
        borderRadius: 1,
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

interface PayableApprovalFlowSectionProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
  payableId: string;
  currentStatus: string;
  showUserEmail?: boolean;
  roleDesignVariant?: 'old' | 'new';
}

export const PayableApprovalFlowSection = ({
  approvalPolicy,
  payableId,
  showUserEmail,
  roleDesignVariant = 'old',
}: PayableApprovalFlowSectionProps) => {
  const { i18n } = useLingui();
  const { steps, isLoading } = useResolvedApprovalStepsWithPolicy(
    payableId,
    approvalPolicy
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {t(i18n)`Approval flow`}
      </Typography>

      <Paper variant="outlined" sx={{ mt: 2 }}>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableBody>
            {steps.map((step, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{ verticalAlign: 'middle', py: 2, width: '120px' }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {step.type}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    verticalAlign: 'middle',
                    minWidth: '52px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.isRoleBased ? (
                    step.roleIds.length > 0 ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="nowrap"
                        useFlexGap
                        sx={{
                          overflow: 'hidden',
                          '& > *': {
                            flexShrink: 0,
                          },
                        }}
                      >
                        {step.resolvedRoles.map(
                          (role) =>
                            role && (
                              <RoleCell
                                key={role.id}
                                roleId={role.id}
                                roleData={role}
                                designVariant={roleDesignVariant}
                              />
                            )
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t(i18n)`No roles assigned`}
                      </Typography>
                    )
                  ) : step.userNames.length > 0 ? (
                    <Stack
                      direction="column"
                      spacing={0.5}
                      sx={{
                        overflow: 'hidden',
                      }}
                    >
                      {step.resolvedUsers.map((user) => {
                        if (!user) return null;

                        return (
                          <UserDisplayCell
                            key={user.id}
                            user={user}
                            showUserEmail={showUserEmail}
                            showAvatar={false}
                            typographyVariant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t(i18n)`No users assigned`}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    textAlign: 'right',
                    verticalAlign: 'middle',
                    width: '140px',
                  }}
                >
                  <PayableStatusChip status={step.payableStatus} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
