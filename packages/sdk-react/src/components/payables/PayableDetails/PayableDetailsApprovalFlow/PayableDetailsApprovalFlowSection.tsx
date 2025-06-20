import { useMemo } from 'react';

import { components } from '@/api';
import { UUserSquare } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/icons/UUserSquare';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip/PayableStatusChip';
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

interface RoleCellProps {
  roleId: string;
}

const RoleCell = ({ roleId }: RoleCellProps) => {
  const { api } = useMoniteContext();

  const { data: role, isLoading } = api.roles.getRolesId.useQuery({
    path: { role_id: roleId },
  });

  if (!role) {
    return null;
  }

  return (
    <Chip
      avatar={<UUserSquare width={18} />}
      label={
        isLoading ? (
          <Skeleton height="50%" width={100} animation="wave" />
        ) : (
          role.name
        )
      }
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

const mapApprovalStatusToPayableStatus = (
  status: components['schemas']['ApprovalRequestStatus']
): components['schemas']['PayableStateEnum'] => {
  switch (status) {
    case 'approved':
      return 'waiting_to_be_paid';
    case 'rejected':
      return 'rejected';
    case 'canceled':
      return 'canceled';
    case 'waiting':
    default:
      return 'approve_in_progress';
  }
};

interface PayableApprovalFlowSectionProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
  payableId: string;
  currentStatus: string;
}

interface ApprovalStep {
  stepNumber: number;
  assignees: string[];
  roleIds: string[];
  assignee?: string;
  type: string;
  status: components['schemas']['ApprovalRequestStatus'];
  payableStatus: components['schemas']['PayableStateEnum'];
  isRoleBased: boolean;
}

export const PayableApprovalFlowSection: React.FC<
  PayableApprovalFlowSectionProps
> = ({
  approvalPolicy: _approvalPolicy,
  payableId,
  currentStatus: _currentStatus,
}) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const { data: approvalRequests, isLoading: isLoadingRequests } =
    api.approvalRequests.getApprovalRequests.useQuery({
      query: {
        object_id: payableId,
        object_type: 'payable',
        limit: 50,
      },
    });

  const { data: approvalPolicyDetails, isLoading: isLoadingPolicy } =
    api.approvalPolicies.getApprovalPoliciesId.useQuery({
      path: { approval_policy_id: _approvalPolicy.id },
    });

  const requests = approvalRequests?.data || [];
  const policyScript = useMemo(
    () => approvalPolicyDetails?.script || [],
    [approvalPolicyDetails]
  );

  const allUserIds = useMemo(() => {
    const userIds = new Set<string>();
    policyScript.forEach((scriptStep: any) => {
      const approvalCalls = scriptStep.all || [];
      const userApprovalCall = approvalCalls.find(
        (call: any) =>
          call.call === 'ApprovalRequests.request_approval_by_users'
      );
      if (userApprovalCall?.params?.user_ids) {
        userApprovalCall.params.user_ids.forEach((userId: string) =>
          userIds.add(userId)
        );
      }
    });
    return Array.from(userIds);
  }, [policyScript]);

  const { data: entityUsers } = api.entityUsers.getEntityUsers.useQuery(
    {
      query: {
        id__in: allUserIds.length > 0 ? allUserIds : undefined,
        limit: 100,
      },
    },
    {
      enabled: allUserIds.length > 0,
    }
  );

  const userDataMap = useMemo(() => {
    const map = new Map<string, any>();
    if (entityUsers?.data) {
      entityUsers.data.forEach((user) => {
        map.set(user.id, user);
      });
    }
    return map;
  }, [entityUsers]);

  const isLoading = isLoadingRequests || isLoadingPolicy;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  const getApprovalRuleLabel = (
    userApprovalCall: any,
    roleApprovalCall: any
  ) => {
    if (userApprovalCall && userApprovalCall.params) {
      const { user_ids, required_approval_count } = userApprovalCall.params;

      if (user_ids && user_ids.length === 1) {
        return t(i18n)`Single user`;
      } else if (user_ids && user_ids.length > 1) {
        if (required_approval_count === 1) {
          return t(i18n)`Any user from the list`;
        }
        return t(i18n)`Any ${required_approval_count} users from the list`;
      }
    }

    if (roleApprovalCall && roleApprovalCall.params) {
      return t(i18n)`Any user with role`;
    }

    return '';
  };

  const approvalSteps: ApprovalStep[] = [];

  policyScript.forEach((scriptStep: any, stepIndex: number) => {
    const approvalCalls = scriptStep.all || [];

    const userApprovalCall = approvalCalls.find(
      (call: any) => call.call === 'ApprovalRequests.request_approval_by_users'
    );

    const roleApprovalCall = approvalCalls.find(
      (call: any) => call.call === 'ApprovalRequests.request_approval_by_roles'
    );

    let assignees: string[] = [];
    let roleIds: string[] = [];

    if (userApprovalCall && userApprovalCall.params) {
      const { user_ids } = userApprovalCall.params;
      if (user_ids && user_ids.length > 0) {
        assignees = user_ids;
      }
    }

    if (roleApprovalCall && roleApprovalCall.params) {
      const { role_ids } = roleApprovalCall.params;
      if (role_ids && role_ids.length > 0) {
        roleIds = role_ids;
      }
    }

    if (
      scriptStep.run_concurrently &&
      assignees.length > 0 &&
      roleIds.length > 0
    ) {
      const userRequests = requests.filter(
        (req) =>
          req.user_ids &&
          req.user_ids.length > 0 &&
          assignees.some((userId) => req.user_ids.includes(userId))
      );
      const userStepStatus =
        userRequests.length > 0 ? userRequests[0].status : 'waiting';

      approvalSteps.push({
        stepNumber: stepIndex + 1,
        type: getApprovalRuleLabel(userApprovalCall, null),
        assignee: undefined,
        assignees: assignees,
        roleIds: [],
        status: userStepStatus,
        payableStatus: mapApprovalStatusToPayableStatus(userStepStatus),
        isRoleBased: false,
      });

      const roleRequests = requests.filter(
        (req) =>
          req.role_ids &&
          req.role_ids.length > 0 &&
          roleIds.some((roleId) => req.role_ids.includes(roleId))
      );
      const roleStepStatus =
        roleRequests.length > 0 ? roleRequests[0].status : 'waiting';

      approvalSteps.push({
        stepNumber: stepIndex + 1,
        type: getApprovalRuleLabel(null, roleApprovalCall),
        assignee: undefined,
        assignees: [],
        roleIds: roleIds,
        status: roleStepStatus,
        payableStatus: mapApprovalStatusToPayableStatus(roleStepStatus),
        isRoleBased: true,
      });
    } else {
      const isRoleBased = roleIds.length > 0 && assignees.length === 0;
      const stepRequests = requests.filter((req) => {
        if (isRoleBased) {
          return (
            req.role_ids &&
            req.role_ids.length > 0 &&
            roleIds.some((roleId) => req.role_ids.includes(roleId))
          );
        } else {
          return (
            req.user_ids &&
            req.user_ids.length > 0 &&
            assignees.some((userId) => req.user_ids.includes(userId))
          );
        }
      });

      const stepStatus =
        stepRequests.length > 0 ? stepRequests[0].status : 'waiting';

      approvalSteps.push({
        stepNumber: stepIndex + 1,
        type: getApprovalRuleLabel(userApprovalCall, roleApprovalCall),
        assignee: undefined,
        assignees: assignees,
        roleIds: roleIds,
        status: stepStatus,
        payableStatus: mapApprovalStatusToPayableStatus(stepStatus),
        isRoleBased: isRoleBased,
      });
    }
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {t(i18n)`Approval flow`}
      </Typography>

      <Paper variant="outlined" sx={{ mt: 2 }}>
        <Table>
          <TableBody>
            {approvalSteps.map((step, index) => (
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
                <TableCell sx={{ py: 2, verticalAlign: 'middle' }}>
                  {step.isRoleBased ? (
                    step.roleIds.length > 0 ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {step.roleIds.map((roleId: string) => (
                          <RoleCell key={roleId} roleId={roleId} />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t(i18n)`No roles assigned`}
                      </Typography>
                    )
                  ) : step.assignees.length > 0 ? (
                    <Stack direction="column" spacing={0.5}>
                      {step.assignees.map((assigneeId: string) => {
                        const entityUser = userDataMap.get(assigneeId);
                        return (
                          <Typography key={assigneeId} variant="body2">
                            {entityUser?.email || '—'}
                          </Typography>
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
                  <PayableStatusChip
                    status={step.payableStatus}
                    size="small"
                    icon={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
