import {
  useCreateApprovalPolicy,
  useUpdateApprovalPolicy,
} from '@/core/queries/useApprovalPolicies';
import { ApprovalPolicyCreate, ApprovalPolicyUpdate } from '@monite/sdk-api';

interface Props {
  /** Callback is fired when the user clicks on `Edit` button */
  onChangeEditMode: (isEdit: boolean) => void;

  /** Callback is fired when a policy is created and sync with server is successful
   *
   * @param id - the ID of the created policy
   */
  onCreated?: (id: string) => void;

  /** Callback is fired when a policy is updated and sync with server is successful
   *
   * @param id - the ID of the updated policy
   */
  onUpdated?: (id: string) => void;
}

export const useApprovalPolicyDetails = ({
  onChangeEditMode,
  onCreated,
  onUpdated,
}: Props) => {
  const createMutation = useCreateApprovalPolicy();
  const updateMutation = useUpdateApprovalPolicy();

  const createApprovalPolicy = async (values: ApprovalPolicyCreate) => {
    const response = await createMutation.mutateAsync(values);

    if (response) {
      onCreated?.(response.id);
      onChangeEditMode(false);
    }
  };

  const updateApprovalPolicy = async (
    id: string,
    values: ApprovalPolicyUpdate
  ) => {
    const response = await updateMutation.mutateAsync({
      approvalPolicyId: id,
      body: values,
    });

    if (response) {
      onUpdated?.(response.id);
      onChangeEditMode(false);
    }

    return response;
  };

  return {
    createApprovalPolicy,
    isCreating: createMutation.isLoading,
    updateApprovalPolicy,
    isUpdating: updateMutation.isLoading,
  };
};
