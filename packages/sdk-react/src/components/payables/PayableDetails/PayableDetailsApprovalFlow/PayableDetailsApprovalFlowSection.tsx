import { components } from '@/api';
import { Role } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/Role';
import { User } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/User';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip/PayableStatusChip';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import { useResolvedApprovalStepsWithPolicy } from './useResolvedApprovalSteps';

interface PayableApprovalFlowSectionProps {
  approvalPolicy: ApprovalPolicyResource;
  payableId: string;
  currentStatus: string;
  showUsersAsEmail?: boolean;
}

export const PayableApprovalFlowSection = ({
  approvalPolicy,
  payableId,
  showUsersAsEmail = true,
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

  if (!steps.length) {
    return null;
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
                  sx={{ verticalAlign: 'middle', py: 2, width: '160px' }}
                >
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      fontWeight: 'normal',
                    }}
                  >
                    {step.type}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    verticalAlign: 'middle',
                    minWidth: '52px',
                  }}
                >
                  {step.isRoleBased ? (
                    step.roleIds.length > 0 ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{
                          '& > *': {
                            flexShrink: 0,
                          },
                        }}
                      >
                        {step.resolvedRoles.map(
                          (role) =>
                            role && (
                              <Role
                                key={role.id}
                                roleId={role.id}
                                roleData={role}
                                quoted={true}
                              />
                            )
                        )}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 'medium',
                        }}
                      >
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
                          <User
                            key={user.id}
                            user={user}
                            variant="cell"
                            showUsersAsEmail={showUsersAsEmail}
                            showAvatar={false}
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 'medium',
                      }}
                    >
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

type ApprovalPolicyResource = components['schemas']['ApprovalPolicyResource'];
