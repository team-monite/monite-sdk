import { getLayoutStyles } from './getLayoutStyles';
import type { LayoutStylesParams } from './TablePagination.types';

describe('getLayoutStyles', () => {
  describe('when hasPageSizeSelect is false', () => {
    it('returns centered layout regardless of other params', () => {
      const result = getLayoutStyles({
        layout: 'default',
        navigationPosition: 'left',
        pageSizePosition: 'right',
        hasPageSizeSelect: false,
      });

      expect(result).toEqual({
        justifyContent: 'center',
        flexDirection: 'row',
        gap: undefined,
      });
    });

    it('returns centered layout even with custom layout', () => {
      const result = getLayoutStyles({
        layout: 'custom',
        navigationPosition: 'right',
        pageSizePosition: 'center',
        hasPageSizeSelect: false,
      });

      expect(result).toEqual({
        justifyContent: 'center',
        flexDirection: 'row',
        gap: undefined,
      });
    });
  });

  describe('preset layouts', () => {
    const baseParams: LayoutStylesParams = {
      layout: 'default',
      navigationPosition: 'left',
      pageSizePosition: 'right',
      hasPageSizeSelect: true,
    };

    it('returns correct styles for default layout', () => {
      const result = getLayoutStyles(baseParams);

      expect(result).toEqual({
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: undefined,
      });
    });

    it('returns correct styles for reversed layout', () => {
      const result = getLayoutStyles({
        ...baseParams,
        layout: 'reversed',
      });

      expect(result).toEqual({
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        gap: undefined,
      });
    });

    it('returns correct styles for centered layout', () => {
      const result = getLayoutStyles({
        ...baseParams,
        layout: 'centered',
      });

      expect(result).toEqual({
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 3,
      });
    });
  });

  describe('custom layout - both controls in same position', () => {
    const baseParams: LayoutStylesParams = {
      layout: 'custom',
      navigationPosition: 'left',
      pageSizePosition: 'right',
      hasPageSizeSelect: true,
    };

    it('returns correct styles when both in center', () => {
      const result = getLayoutStyles({
        ...baseParams,
        navigationPosition: 'center',
        pageSizePosition: 'center',
      });

      expect(result).toEqual({
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 3,
      });
    });

    it('returns correct styles when both on left', () => {
      const result = getLayoutStyles({
        ...baseParams,
        navigationPosition: 'left',
        pageSizePosition: 'left',
      });

      expect(result).toEqual({
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 3,
      });
    });

    it('returns correct styles when both on right', () => {
      const result = getLayoutStyles({
        ...baseParams,
        navigationPosition: 'right',
        pageSizePosition: 'right',
      });

      expect(result).toEqual({
        justifyContent: 'flex-end',
        flexDirection: 'row-reverse',
        gap: 3,
      });
    });
  });

  describe('custom layout - controls on opposite sides', () => {
    const baseParams: LayoutStylesParams = {
      layout: 'custom',
      navigationPosition: 'left',
      pageSizePosition: 'right',
      hasPageSizeSelect: true,
    };

    it('returns correct styles for navigation left, size right', () => {
      const result = getLayoutStyles(baseParams);

      expect(result).toEqual({
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: undefined,
      });
    });

    it('returns correct styles for navigation right, size left', () => {
      const result = getLayoutStyles({
        ...baseParams,
        navigationPosition: 'right',
        pageSizePosition: 'left',
      });

      expect(result).toEqual({
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        gap: undefined,
      });
    });
  });

  describe('custom layout - navigation center with size on side', () => {
    const baseParams: LayoutStylesParams = {
      layout: 'custom',
      navigationPosition: 'center',
      pageSizePosition: 'right',
      hasPageSizeSelect: true,
    };

    it('returns correct styles for navigation center, size right', () => {
      const result = getLayoutStyles(baseParams);

      expect(result).toEqual({
        justifyContent: 'space-around',
        flexDirection: 'row',
        gap: undefined,
      });
    });

    it('returns correct styles for navigation center, size left', () => {
      const result = getLayoutStyles({
        ...baseParams,
        pageSizePosition: 'left',
      });

      expect(result).toEqual({
        justifyContent: 'space-around',
        flexDirection: 'row-reverse',
        gap: undefined,
      });
    });
  });

  describe('custom layout - size center with navigation on side', () => {
    const baseParams: LayoutStylesParams = {
      layout: 'custom',
      navigationPosition: 'left',
      pageSizePosition: 'center',
      hasPageSizeSelect: true,
    };

    it('returns correct styles for navigation left, size center', () => {
      const result = getLayoutStyles(baseParams);

      expect(result).toEqual({
        justifyContent: 'space-around',
        flexDirection: 'row',
        gap: undefined,
      });
    });

    it('returns correct styles for navigation right, size center', () => {
      const result = getLayoutStyles({
        ...baseParams,
        navigationPosition: 'right',
      });

      expect(result).toEqual({
        justifyContent: 'space-around',
        flexDirection: 'row-reverse',
        gap: undefined,
      });
    });
  });

  describe('edge cases', () => {
    it('handles custom layout with navigation and size in unexpected combination', () => {
      // When no specific condition matches in custom layout,
      // it falls through to default preset layout handling
      const result = getLayoutStyles({
        layout: 'custom',
        navigationPosition: 'left',
        pageSizePosition: 'right',
        hasPageSizeSelect: true,
      });

      // This is the navigation left, size right case
      expect(result).toEqual({
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: undefined,
      });
    });
  });
});
