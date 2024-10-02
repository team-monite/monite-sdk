import { ApprovalPoliciesTable } from '@/components';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { screen, waitFor } from '@testing-library/react';

import './ApprovalPoliciesTable';

describe('ApprovalPoliciesTable', () => {
  describe('# Triggers', () => {
    test('should have "Created by user" trigger on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitUntilTableIsLoaded();

      const trigger = await screen.findAllByText(t`Created by user`);

      expect(trigger.length).toBeGreaterThanOrEqual(2);
    });

    test('should have "Tags" trigger on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const triggers = await screen.findAllByText(t`Counterparts`);

      expect(triggers.length).toBeGreaterThanOrEqual(2);
    });

    test('should have 2 "Counterparts" triggers on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitFor(async () => {
        const triggers = await screen.getAllByText(t`Counterparts`);

        expect(triggers.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('should have 2 "Amount" triggers on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitFor(async () => {
        const triggers = await screen.findAllByText(t`Amount`);

        expect(triggers.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('# Rules', () => {
    test(`should have "Single user" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const rules = await screen.findAllByText(t`Single user`);

      expect(rules.length).toBeGreaterThanOrEqual(2);
    });

    test(`should have "Users from the list" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const rules = await screen.findAllByText(t`Users from the list`);

      expect(rules.length).toBeGreaterThanOrEqual(2);
    });

    test(`should have "Approval chain" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const rules = await screen.findAllByText(t`Approval chain`);

      expect(rules.length).toBeGreaterThanOrEqual(2);
    });

    test(`should have "Roles from the list" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const rules = await screen.findAllByText(t`Roles from the list`);

      expect(rules.length).toBeGreaterThanOrEqual(2);
    });
  });
});
