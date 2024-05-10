import { ApprovalPoliciesTable } from '@/components';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { screen, waitFor } from '@testing-library/react';

import './ApprovalPoliciesTable';

describe('ApprovalPoliciesTable', () => {
  describe('# Triggers', () => {
    test('should have 2 "Amount" triggers on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitFor(async () => {
        const triggers = await screen.findAllByText(t`Amount`);

        expect(triggers.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('should have 2 "Currency" triggers on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitFor(async () => {
        const triggers = await screen.findAllByText(t`Currency`);

        expect(triggers.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('should have 2 "Counterparts" triggers on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitFor(async () => {
        const triggers = await screen.getAllByText(t`Counterparts`);

        expect(triggers.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('should have "Tags" trigger on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const triggers = await screen.findAllByText(t`Counterparts`);

      expect(triggers.length).toBeGreaterThanOrEqual(1);
    });

    test('should have "Created by user" trigger on the page', async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      await waitUntilTableIsLoaded();

      const trigger = await screen.findByText(t`Created by user`);

      expect(trigger).toBeInTheDocument();
    });
  });

  describe('# Rules', () => {
    test(`should have "Users from the list" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const title = await screen.findByText(`${t`Users from the list`}`);

      expect(title).toBeInTheDocument();
    });

    test(`should have "Users from the list (2x)" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const title = await screen.findByText(`${t`Users from the list`} (x2)`);

      expect(title).toBeInTheDocument();
    });

    test(`should have "Role approval" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const title = await screen.findByText(`${t`Role approval`}`);

      expect(title).toBeInTheDocument();
    });

    test(`should have "Approval chain" on the page`, async () => {
      renderWithClient(<ApprovalPoliciesTable />);

      const approvalChains = await screen.findAllByText(`${t`Approval chain`}`);

      expect(approvalChains.length).toBeGreaterThanOrEqual(1);
    });
  });
});
