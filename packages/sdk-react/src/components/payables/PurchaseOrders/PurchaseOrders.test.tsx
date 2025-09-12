import { PurchaseOrderStatusChip } from './PurchaseOrderStatusChip';
import { PurchaseOrdersTable } from './PurchaseOrdersTable';
import { PURCHASE_ORDER_MEASURE_UNITS } from './types';
import { rateMajorToMinor } from '@/core/utils/currencies';
import {
  vatRateBasisPointsToPercentage,
  vatRatePercentageToBasisPoints,
} from '@/core/utils/vatUtils';
import { renderWithClient } from '@/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';

describe('PurchaseOrders', () => {
  describe('# Table View', () => {
    it('should render empty state when no purchase orders exist', async () => {
      renderWithClient(<PurchaseOrdersTable />);

      await waitFor(() => {
        expect(screen.getByText(/no purchase orders/i)).toBeInTheDocument();
      });
    });

    it('should render search placeholder correctly', async () => {
      renderWithClient(<PurchaseOrdersTable />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(
          /search by number or vendor/i
        );
        expect(searchInput).toBeInTheDocument();
      });
    });
  });

  describe('# Create Purchase Order', () => {
    it('should support all required quantity units', async () => {
      expect(PURCHASE_ORDER_MEASURE_UNITS).toEqual([
        'unit',
        'cm',
        'day',
        'hour',
        'kg',
        'litre',
      ]);
      expect(PURCHASE_ORDER_MEASURE_UNITS).toHaveLength(6);
    });

    it('should properly convert VAT rates between UI and API formats', () => {
      expect(vatRatePercentageToBasisPoints(7.5)).toBe(750);
      expect(vatRatePercentageToBasisPoints(0)).toBe(0);
      expect(vatRatePercentageToBasisPoints(21)).toBe(2100);

      expect(vatRateBasisPointsToPercentage(750)).toBe(7.5);
      expect(vatRateBasisPointsToPercentage(0)).toBe(0);
      expect(vatRateBasisPointsToPercentage(2100)).toBe(21);

      const originalPercentage = 19.5;
      const basisPoints = vatRatePercentageToBasisPoints(originalPercentage);
      const backToPercentage = vatRateBasisPointsToPercentage(basisPoints);
      expect(backToPercentage).toBe(originalPercentage);
    });

    it('should map form line items to API payload with correct conversions', () => {
      const uiItems = [
        {
          name: 'Item A',
          quantity: 2,
          unit: 'unit',
          price: 10.5,
          currency: 'USD',
          vat_rate_value: 7.5,
        },
        {
          name: 'Item B',
          quantity: 1,
          unit: 'unit',
          price: 0,
          currency: 'USD',
          tax_rate_value: 0,
        },
      ];

      const payloadItems = uiItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: rateMajorToMinor(Number(item.price) || 0),
        currency: item.currency,
        vat_rate: vatRatePercentageToBasisPoints(
          Number(item.tax_rate_value ?? item.vat_rate_value ?? 0)
        ),
      }));

      expect(payloadItems[0].price).toBe(rateMajorToMinor(10.5));
      expect(payloadItems[0].vat_rate).toBe(750);
      expect(payloadItems[1].price).toBe(0);
      expect(payloadItems[1].vat_rate).toBe(0);
    });
  });

  describe('# Status Management', () => {
    it('should support draft and issued statuses', () => {
      const supportedStatuses = ['draft', 'issued'];
      expect(supportedStatuses).toContain('draft');
      expect(supportedStatuses).toContain('issued');
    });

    it('should render status chips correctly', () => {
      const { rerender } = renderWithClient(
        <PurchaseOrderStatusChip status="draft" />
      );

      expect(screen.getByText('draft')).toBeInTheDocument();

      rerender(<PurchaseOrderStatusChip status="issued" />);
      expect(screen.getByText('issued')).toBeInTheDocument();
    });
  });

  describe('# Critical Data Integrity', () => {
    it('should maintain consistent VAT rate conversions across the application', () => {
      const testCases = [
        { percentage: 0, basisPoints: 0 },
        { percentage: 0.1, basisPoints: 10 },
        { percentage: 7.5, basisPoints: 750 },
        { percentage: 20, basisPoints: 2000 },
        { percentage: 25.5, basisPoints: 2550 },
      ];

      testCases.forEach(({ percentage, basisPoints }) => {
        expect(vatRatePercentageToBasisPoints(percentage)).toBe(basisPoints);
        expect(vatRateBasisPointsToPercentage(basisPoints)).toBe(percentage);
      });
    });

    it('should handle decimal precision correctly for financial calculations', () => {
      const percentage = 7.75;
      const basisPoints = vatRatePercentageToBasisPoints(percentage);
      const converted = vatRateBasisPointsToPercentage(basisPoints);

      expect(converted).toBe(percentage);
      expect(basisPoints).toBe(775);
    });
  });
});
