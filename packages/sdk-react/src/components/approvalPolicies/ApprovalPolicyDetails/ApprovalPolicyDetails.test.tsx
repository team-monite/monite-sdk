import React from 'react';

import { approvalPoliciesSearchFixture } from '@/mocks/approvalPolicies/approvalPoliciesFixture';
import {
  cachedMoniteSDK,
  renderWithClient,
  triggerChangeInput,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApprovalPolicyDetails } from './ApprovalPolicyDetails';

const fillForm = async (
  name: string,
  description: string,
  trigger: string,
  script: string
) => {
  triggerChangeInput(/Policy Name/i, name);
  triggerChangeInput(/Description/i, description);
  triggerChangeInput(/Trigger in Monite Script/i, trigger);
  triggerChangeInput(/Script in Monite Script/i, script);
};

describe('ApprovalPolicyDetails', () => {
  describe('#FormValidation', () => {
    test('should show error message when fields are empty and form is submitted', async () => {
      renderWithClient(<ApprovalPolicyDetails />);

      const createButton = screen.getByRole('button', {
        name: /Create/i,
      });

      fireEvent.click(createButton);

      const errorMessages = await screen.findAllByText(/is a required field/i);

      expect(errorMessages.length).toBe(4);
    });
  });

  const user = userEvent.setup();

  const name = 'Test Policy';
  const description = 'Test Description';
  const trigger = JSON.stringify(approvalPoliciesSearchFixture.data[0].trigger);
  const script = JSON.stringify(approvalPoliciesSearchFixture.data[0].script);

  describe('# Public API', () => {
    test('should trigger "onCreated" after successful creation', async () => {
      const onCreatedMock = jest.fn();

      renderWithClient(<ApprovalPolicyDetails onCreated={onCreatedMock} />);

      await fillForm(name, description, trigger, script);

      const createButton = screen.getByRole('button', {
        name: /Create/i,
      });

      await user.click(createButton);

      await waitFor(() => {
        expect(onCreatedMock).toHaveBeenCalled();
      });
    });

    test('should trigger "onUpdated" after successful update', async () => {
      const onUpdatedMock = jest.fn();
      const approvalPolicyId = approvalPoliciesSearchFixture.data[0].id;

      renderWithClient(
        <ApprovalPolicyDetails
          id={approvalPolicyId}
          onUpdated={onUpdatedMock}
        />
      );

      await waitUntilTableIsLoaded();

      const editButton = screen.getByRole('button', {
        name: /Edit/i,
      });

      await user.click(editButton);

      await fillForm(name, description, trigger, script);

      const updateButton = screen.getByRole('button', {
        name: /Update/i,
      });

      await user.click(updateButton);

      await waitFor(() => {
        expect(onUpdatedMock).toHaveBeenCalled();
      });
    });
  });

  test('should send the correct data to the server', async () => {
    const onCreatedMock = jest.fn();
    const createApprovalPolicy = jest.spyOn(
      cachedMoniteSDK.api.approvalPolicies,
      'create'
    );

    renderWithClient(<ApprovalPolicyDetails onCreated={onCreatedMock} />);

    await fillForm(name, description, trigger, script);

    const createButton = screen.getByRole('button', {
      name: /Create/i,
    });

    await user.click(createButton);

    const callArguments = createApprovalPolicy.mock.calls;

    if (!callArguments.length) {
      throw new Error('createApprovalPolicy was not called');
    }

    const requestBody = callArguments[0][0];

    expect(requestBody).toMatchObject({
      name,
      description,
      trigger: approvalPoliciesSearchFixture.data[0].trigger,
      script: approvalPoliciesSearchFixture.data[0].script,
    });

    createApprovalPolicy.mockClear();
  });

  // As QA team reported, it is not clear when the script should be an array when the user is creating a new policy with one script object.
  // This test is to ensure that the script is always an array when creating a new policy.
  test('should create an array from "script" field value if it is a single object', async () => {
    const onCreatedMock = jest.fn();
    const createApprovalPolicy = jest.spyOn(
      cachedMoniteSDK.api.approvalPolicies,
      'create'
    );
    const singleScriptObject = { key: 'value' };

    renderWithClient(<ApprovalPolicyDetails onCreated={onCreatedMock} />);

    await fillForm(
      name,
      description,
      trigger,
      JSON.stringify(singleScriptObject)
    );

    const createButton = screen.getByRole('button', {
      name: /Create/i,
    });

    await user.click(createButton);

    const callArguments = createApprovalPolicy.mock.calls;

    if (!callArguments.length) {
      throw new Error('createApprovalPolicy was not called');
    }

    const requestBody = callArguments[0][0];

    await waitFor(() => {
      expect(onCreatedMock).toHaveBeenCalled();
      const createdScript = requestBody.script;
      expect(Array.isArray(createdScript)).toBe(true);
      expect(createdScript[0]).toEqual(singleScriptObject);
    });

    createApprovalPolicy.mockClear();
  });
});
