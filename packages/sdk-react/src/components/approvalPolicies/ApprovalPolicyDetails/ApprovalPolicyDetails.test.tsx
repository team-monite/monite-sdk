import { approvalPoliciesListFixture } from '@/mocks/approvalPolicies/approvalPoliciesFixture';
import {
  renderWithClient,
  triggerChangeInput,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { components } from '@monite/sdk-api/src/api';
import { requestFn } from '@openapi-qraft/react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApprovalPolicyDetails } from './ApprovalPolicyDetails';

const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

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

// TODO enable these tests for advanced mode https://monite.atlassian.net/browse/DEV-12334
describe.skip('ApprovalPolicyDetails', () => {
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
  const trigger = JSON.stringify(approvalPoliciesListFixture.data[0].trigger);
  const script = JSON.stringify(approvalPoliciesListFixture.data[0].script);

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
      const approvalPolicyId = approvalPoliciesListFixture.data[0].id;

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

      await waitFor(() => {
        expect(editButton).not.toBeDisabled();
      });

      await user.click(editButton);

      await fillForm(name, description, trigger, script);

      const updateButton = screen.getByRole('button', {
        name: /Update/i,
      });

      await waitFor(() => {
        expect(updateButton).not.toBeDisabled();
      });

      await user.click(updateButton);

      await waitFor(() => {
        expect(onUpdatedMock).toHaveBeenCalled();
      });
    });
  });

  test('should send the correct data to the server', async () => {
    const onCreatedMock = jest.fn();

    renderWithClient(<ApprovalPolicyDetails onCreated={onCreatedMock} />);

    await fillForm(name, description, trigger, script);

    const createButton = screen.getByRole('button', {
      name: /Create/i,
    });

    await user.click(createButton);

    expect(requestFnMock.mock.lastCall?.[1].body).toMatchObject({
      name,
      description,
      trigger: approvalPoliciesListFixture.data[0].trigger,
      script: approvalPoliciesListFixture.data[0].script,
    });
  });

  // As QA team reported, it is not clear when the script should be an array when the user is creating a new policy with one script object.
  // This test is to ensure that the script is always an array when creating a new policy.
  test('should create an array from "script" field value if it is a single object', async () => {
    const onCreatedMock = jest.fn();
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

    await waitFor(() => expect(onCreatedMock).toHaveBeenCalled());
    await waitFor(() => {
      const createdScript = (
        requestFnMock.mock.lastCall?.[1]
          .body as components['schemas']['ApprovalPolicyCreate']
      ).script;
      expect(Array.isArray(createdScript)).toBe(true);
      expect(createdScript[0]).toEqual(singleScriptObject);
    });
  });
});
