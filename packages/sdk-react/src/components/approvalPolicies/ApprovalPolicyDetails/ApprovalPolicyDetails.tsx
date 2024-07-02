'use client';

import React, { useState } from 'react';

import { useApprovalPolicyById } from '@/core/queries';
import { LoadingPage } from '@/ui/loadingPage';

import { ApprovalPolicyDetailsForm } from './ApprovalPolicyDetailsForm';
import { ExistingApprovalPolicyDetails } from './ExistingApprovalPolicyDetails';

export interface ApprovalPolicyDetailsProps {
  /** Approval policy ID */
  id?: string;

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

/**
 * ApprovalPolicyDetails component
 *
 * This component renders the approval policy details form. It includes fields for the policy name, description, trigger, and script.
 * The `useApprovalPolicyDetails` hook is used to handle the creation of a new approval policy.
 *
 */
export const ApprovalPolicyDetails = ({
  id,
  onCreated,
  onUpdated,
}: ApprovalPolicyDetailsProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { isLoading, data: approvalPolicy } = useApprovalPolicyById(id);

  if (id && isLoading) {
    return <LoadingPage />;
  }

  if (!isEdit && approvalPolicy) {
    // READ
    return (
      <ExistingApprovalPolicyDetails
        approvalPolicy={approvalPolicy}
        onChangeEditMode={setIsEdit}
      />
    );
  }

  if (isEdit && id) {
    // UPDATE
    return (
      <ApprovalPolicyDetailsForm
        approvalPolicy={approvalPolicy}
        onUpdated={onUpdated}
        onChangeEditMode={setIsEdit}
      />
    );
  }

  // CREATE by default
  return (
    <ApprovalPolicyDetailsForm
      onCreated={onCreated}
      onChangeEditMode={setIsEdit}
    />
  );
};
