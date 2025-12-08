import { describe, it, expect } from 'vitest';
import { getTextFormat } from '../style';

describe('getTextFormat', () => {
  describe('thickness calculation', () => {
    it('should calculate thickness correctly based on fontSize', () => {
      // At 24px font size (the reference size), thickness should be 1
      const format24 = getTextFormat({ underline: true, fontSize: 24 });
      expect(format24.underline.thickness).toBe(1);

      // At 48px font size (2x), thickness should be 2
      const format48 = getTextFormat({ underline: true, fontSize: 48 });
      expect(format48.underline.thickness).toBe(2);

      // At 12px font size (0.5x), thickness should be 0.5
      const format12 = getTextFormat({ underline: true, fontSize: 12 });
      expect(format12.underline.thickness).toBe(0.5);

      // Should work the same for strikethrough
      const formatStrike = getTextFormat({ strikethrough: true, fontSize: 36 });
      expect(formatStrike.strikethrough.thickness).toBe(1.5);
    });
  });

  describe('offset calculation for different font families', () => {
    it('should apply a default offset of -2 for Roboto font family scaled by fontSizeFactor', () => {
      // At 24px font size (reference size), offset should be -2
      const format24 = getTextFormat({
        underline: true,
        fontSize: 24,
        fontFamily: 'Roboto',
      });
      expect(format24.underline.offset).toBe(-2);

      // At 48px font size (2x), offset should be -4
      const format48 = getTextFormat({
        underline: true,
        fontSize: 48,
        fontFamily: 'Roboto',
      });
      expect(format48.underline.offset).toBe(-4);

      // At 12px font size (0.5x), offset should be -1
      const format12 = getTextFormat({
        underline: true,
        fontSize: 12,
        fontFamily: 'Roboto',
      });
      expect(format12.underline.offset).toBe(-1);

      // Should work for font families that start with Roboto
      const formatRobotoBold = getTextFormat({
        strikethrough: true,
        fontSize: 24,
        fontFamily: 'Roboto Bold',
      });
      expect(formatRobotoBold.strikethrough.offset).toBe(-2);

      // Should also work for Verdana (same offset as Roboto)
      const formatVerdana = getTextFormat({
        underline: true,
        fontSize: 24,
        fontFamily: 'Verdana',
      });
      expect(formatVerdana.underline.offset).toBe(-2);
    });

    it('should apply a default offset of -1 for Inter font family scaled by fontSizeFactor', () => {
      // At 24px font size (reference size), offset should be -1
      const format24 = getTextFormat({
        underline: true,
        fontSize: 24,
        fontFamily: 'Inter',
      });
      expect(format24.underline.offset).toBe(-1);

      // At 48px font size (2x), offset should be -2
      const format48 = getTextFormat({
        underline: true,
        fontSize: 48,
        fontFamily: 'Inter',
      });
      expect(format48.underline.offset).toBe(-2);

      // At 12px font size (0.5x), offset should be -0.5
      const format12 = getTextFormat({
        underline: true,
        fontSize: 12,
        fontFamily: 'Inter',
      });
      expect(format12.underline.offset).toBe(-0.5);

      // Should also work for Montserrat (same offset as Inter)
      const formatMontserrat = getTextFormat({
        strikethrough: true,
        fontSize: 24,
        fontFamily: 'Montserrat',
      });
      expect(formatMontserrat.strikethrough.offset).toBe(-1);

      // Should work for font families that start with Montserrat
      const formatMontserratBold = getTextFormat({
        underline: true,
        fontSize: 24,
        fontFamily: 'Montserrat Bold',
      });
      expect(formatMontserratBold.underline.offset).toBe(-1);
    });

    it('should apply a default offset of -5 for Comic Sans font family scaled by fontSizeFactor', () => {
      // At 24px font size (reference size), offset should be -5
      const format24 = getTextFormat({
        underline: true,
        fontSize: 24,
        fontFamily: 'Comic Sans',
      });
      expect(format24.underline.offset).toBe(-5);

      // At 48px font size (2x), offset should be -10
      const format48 = getTextFormat({
        underline: true,
        fontSize: 48,
        fontFamily: 'Comic Sans',
      });
      expect(format48.underline.offset).toBe(-10);

      // At 12px font size (0.5x), offset should be -2.5
      const format12 = getTextFormat({
        underline: true,
        fontSize: 12,
        fontFamily: 'Comic Sans',
      });
      expect(format12.underline.offset).toBe(-2.5);

      // Should work for font families that start with Comic Sans
      const formatComicSansMS = getTextFormat({
        strikethrough: true,
        fontSize: 24,
        fontFamily: 'Comic Sans MS',
      });
      expect(formatComicSansMS.strikethrough.offset).toBe(-5);
    });

    it('should apply a default offset of 0 for unspecified font families scaled by fontSizeFactor', () => {
      // At 24px font size (reference size), offset should be 0
      const format24Arial = getTextFormat({
        underline: true,
        fontSize: 24,
        fontFamily: 'Arial',
      });
      expect(format24Arial.underline.offset).toBe(0);

      // At 48px font size (2x), offset should still be 0
      const format48Times = getTextFormat({
        underline: true,
        fontSize: 48,
        fontFamily: 'Times New Roman',
      });
      expect(format48Times.underline.offset).toBe(0);

      // At 12px font size (0.5x), offset should still be 0
      const format12Helvetica = getTextFormat({
        strikethrough: true,
        fontSize: 12,
        fontFamily: 'Helvetica',
      });
      expect(format12Helvetica.strikethrough.offset).toBe(0);

      // Default font family should also have 0 offset
      const formatDefault = getTextFormat({
        underline: true,
        fontSize: 24,
      });
      expect(formatDefault.underline.offset).toBe(0);
    });
  });

  describe('merging with undefined values', () => {
    it('should not override underline.color when merging with undefined color', () => {
      // When format has { underline: { color: undefined, thickness: 2 } } and
      // baseFormat has { underline: { color: 'red' } }, the undefined color should
      // not override the existing 'red' value from baseFormat
      const result = getTextFormat(
        { underline: { color: undefined, thickness: 2 } },
        { underline: { color: 'red' } }
      );
      expect(result.underline.color).toBe('red');
      expect(result.underline.thickness).toBe(2);
    });

    it('should not override underline.thickness when merging with undefined thickness', () => {
      // baseFormat sets thickness to 5, format sets thickness to undefined (with another property set)
      // Expected: thickness should remain 5 from baseFormat
      const result = getTextFormat(
        { underline: { thickness: undefined, color: 'green' } },
        { underline: { thickness: 5 } }
      );
      expect(result.underline.thickness).toBe(5);
      expect(result.underline.color).toBe('green');
    });

    it('should not override underline.offset when merging with undefined offset', () => {
      // baseFormat sets offset to 10, format sets offset to undefined (with another property set)
      // Expected: offset should remain 10 from baseFormat
      const result = getTextFormat(
        { underline: { offset: undefined, thickness: 3 } },
        { underline: { offset: 10 } }
      );
      expect(result.underline.offset).toBe(10);
      expect(result.underline.thickness).toBe(3);
    });

    it('should not override strikethrough.color when merging with undefined color', () => {
      // baseFormat sets color to 'blue', format sets color to undefined (with another property set)
      // Expected: color should remain 'blue' from baseFormat
      const result = getTextFormat(
        { strikethrough: { color: undefined, thickness: 2 } },
        { strikethrough: { color: 'blue' } }
      );
      expect(result.strikethrough.color).toBe('blue');
      expect(result.strikethrough.thickness).toBe(2);
    });

    it('should not override strikethrough.thickness when merging with undefined thickness', () => {
      // baseFormat sets thickness to 3, format sets thickness to undefined (with another property set)
      // Expected: thickness should remain 3 from baseFormat
      const result = getTextFormat(
        { strikethrough: { thickness: undefined, color: 'yellow' } },
        { strikethrough: { thickness: 3 } }
      );
      expect(result.strikethrough.thickness).toBe(3);
      expect(result.strikethrough.color).toBe('yellow');
    });

    it('should not override strikethrough.offset when merging with undefined offset', () => {
      // baseFormat sets offset to 8, format sets offset to undefined (with another property set)
      // Expected: offset should remain 8 from baseFormat
      const result = getTextFormat(
        { strikethrough: { offset: undefined, thickness: 4 } },
        { strikethrough: { offset: 8 } }
      );
      expect(result.strikethrough.offset).toBe(8);
      expect(result.strikethrough.thickness).toBe(4);
    });
  });
});
