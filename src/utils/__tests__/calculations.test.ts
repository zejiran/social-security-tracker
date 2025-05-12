import { APP_CONFIG } from '../../config';
import {
  calculateBase,
  calculateHealth,
  calculatePension,
  calculateSocialSecurity,
  calculateSolidarity,
  calculateBothMethods,
} from '../calculations';

describe('calculation utils', () => {
  describe('calculateBase', () => {
    it('should calculate direct base correctly', () => {
      // Arrange
      const totalIncome = 5000000;
      const costosPercent = 0.25;
      const isPresumption = false;
      const expected = totalIncome * APP_CONFIG.FORMULA.BASE_PERCENTAGE;

      // Act
      const result = calculateBase(totalIncome, costosPercent, isPresumption);

      // Assert
      expect(result).toBe(expected);
    });

    it('should calculate presumption base correctly', () => {
      // Arrange
      const totalIncome = 5000000;
      const costosPercent = 0.25;
      const isPresumption = true;
      const expected = totalIncome * (1 - costosPercent) * APP_CONFIG.FORMULA.BASE_PERCENTAGE;

      // Act
      const result = calculateBase(totalIncome, costosPercent, isPresumption);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('calculateHealth', () => {
    it('should calculate health contribution correctly', () => {
      // Arrange
      const base = 2000000;
      const expected = base * APP_CONFIG.FORMULA.HEALTH_PERCENTAGE;

      // Act
      const result = calculateHealth(base);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('calculatePension', () => {
    it('should calculate pension contribution correctly', () => {
      // Arrange
      const base = 2000000;
      const expected = base * APP_CONFIG.FORMULA.PENSION_PERCENTAGE;

      // Act
      const result = calculatePension(base);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('calculateSolidarity', () => {
    it('should calculate solidarity contribution when included', () => {
      // Arrange
      const base = 2000000;
      const includeSolidarity = true;
      const expected = base * APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE;

      // Act
      const result = calculateSolidarity(base, includeSolidarity);

      // Assert
      expect(result).toBe(expected);
    });

    it('should return 0 when solidarity is not included', () => {
      // Arrange
      const base = 2000000;
      const includeSolidarity = false;
      const expected = 0;

      // Act
      const result = calculateSolidarity(base, includeSolidarity);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('calculateSocialSecurity', () => {
    it('should calculate all values correctly for direct method', () => {
      // Arrange
      const totalIncome = 5000000;
      const costosPercent = 0.25;
      const includeSolidarity = true;
      const isPresumption = false;

      const base = totalIncome * APP_CONFIG.FORMULA.BASE_PERCENTAGE;
      const health = base * APP_CONFIG.FORMULA.HEALTH_PERCENTAGE;
      const pension = base * APP_CONFIG.FORMULA.PENSION_PERCENTAGE;
      const solidarity = base * APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE;
      const total = health + pension + solidarity;
      const roundedTotal = Math.ceil(total / 100) * 100;

      // Act
      const result = calculateSocialSecurity(
        totalIncome,
        costosPercent,
        includeSolidarity,
        isPresumption
      );

      // Assert
      expect(result.base).toBe(base);
      expect(result.health).toBe(health);
      expect(result.pension).toBe(pension);
      expect(result.solidarity).toBe(solidarity);
      expect(result.total).toBe(total);
      expect(result.roundedTotal).toBe(roundedTotal);
    });

    it('should round the total up to the nearest 100', () => {
      // Arrange
      const totalIncome = 5000123;
      const costosPercent = 0.25;
      const includeSolidarity = true;
      const isPresumption = false;

      // Act
      const result = calculateSocialSecurity(
        totalIncome,
        costosPercent,
        includeSolidarity,
        isPresumption
      );

      // Assert
      expect(result.roundedTotal % 100).toBe(0);
      expect(result.roundedTotal).toBeGreaterThanOrEqual(result.total);
      expect(result.roundedTotal - result.total).toBeLessThan(100);
    });
  });

  describe('calculateBothMethods', () => {
    it('should return both calculation methods', () => {
      // Arrange
      const totalIncome = 5000000;
      const costosPercent = 0.25;
      const includeSolidarity = true;

      // Act
      const result = calculateBothMethods(totalIncome, costosPercent, includeSolidarity);

      // Assert
      expect(result).toHaveProperty('direct');
      expect(result).toHaveProperty('presumption');
      expect(result.direct.base).toBe(totalIncome * APP_CONFIG.FORMULA.BASE_PERCENTAGE);
      expect(result.presumption.base).toBe(
        totalIncome * (1 - costosPercent) * APP_CONFIG.FORMULA.BASE_PERCENTAGE
      );
    });
  });
});
