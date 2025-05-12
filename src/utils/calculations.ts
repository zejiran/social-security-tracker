import { APP_CONFIG } from '../config';
import { SocialSecurityCalculation } from '../types';

/**
 * Calculate base amount for social security calculation
 *
 * @param totalIncome - Total income in COP
 * @param costosPercent - Percentage of costs (for presumption method)
 * @param isPresumption - Whether to use the presumption of costs method
 * @returns The base amount for social security calculations
 */
export const calculateBase = (
  totalIncome: number,
  costosPercent: number,
  isPresumption: boolean
): number => {
  const { BASE_PERCENTAGE } = APP_CONFIG.FORMULA;

  if (isPresumption) {
    // Presumption of costs: Base = 40% of (Income after costs)
    return totalIncome * (1 - costosPercent) * BASE_PERCENTAGE;
  } else {
    // Direct method: Base = 40% of Income
    return totalIncome * BASE_PERCENTAGE;
  }
};

/**
 * Calculate health contribution (12.5% of base)
 *
 * @param base - Base amount for calculations
 * @returns Health contribution amount
 */
export const calculateHealth = (base: number): number => {
  return base * APP_CONFIG.FORMULA.HEALTH_PERCENTAGE;
};

/**
 * Calculate pension contribution (16% of base)
 *
 * @param base - Base amount for calculations
 * @returns Pension contribution amount
 */
export const calculatePension = (base: number): number => {
  return base * APP_CONFIG.FORMULA.PENSION_PERCENTAGE;
};

/**
 * Calculate solidarity contribution (1% of base, if applicable)
 *
 * @param base - Base amount for calculations
 * @param includeSolidarity - Whether to include the solidarity contribution
 * @returns Solidarity contribution amount
 */
export const calculateSolidarity = (base: number, includeSolidarity: boolean): number => {
  return includeSolidarity ? base * APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE : 0;
};

/**
 * Perform all social security calculations
 *
 * @param totalIncome - Total income in COP
 * @param costosPercent - Percentage of costs (for presumption method)
 * @param includeSolidarity - Whether to include solidarity contribution
 * @param isPresumption - Whether to use presumption of costs method
 * @returns Complete calculation result
 */
export const calculateSocialSecurity = (
  totalIncome: number,
  costosPercent: number,
  includeSolidarity: boolean,
  isPresumption: boolean
): SocialSecurityCalculation => {
  const base = calculateBase(totalIncome, costosPercent, isPresumption);
  const health = calculateHealth(base);
  const pension = calculatePension(base);
  const solidarity = calculateSolidarity(base, includeSolidarity);
  const total = health + pension + solidarity;
  const roundedTotal = Math.ceil(total / APP_CONFIG.ROUNDING.UNIT) * APP_CONFIG.ROUNDING.UNIT;

  return {
    base,
    health,
    pension,
    solidarity,
    total,
    roundedTotal,
  };
};

/**
 * Calculate both direct and presumption methods
 *
 * @param totalIncome - Total income in COP
 * @param costosPercent - Percentage of costs (for presumption method)
 * @param includeSolidarity - Whether to include solidarity contribution
 * @returns Both calculation methods
 */
export const calculateBothMethods = (
  totalIncome: number,
  costosPercent: number,
  includeSolidarity: boolean
) => {
  return {
    direct: calculateSocialSecurity(totalIncome, costosPercent, includeSolidarity, false),
    presumption: calculateSocialSecurity(totalIncome, costosPercent, includeSolidarity, true),
  };
};
