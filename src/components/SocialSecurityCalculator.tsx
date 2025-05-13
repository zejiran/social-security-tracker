import { format } from 'date-fns';
import { Check, Copy } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { APP_CONFIG } from '../config';
import { calculateBothMethods } from '../utils/calculations';

interface SocialSecurityCalculatorProps {
  totalIncome: number;
  costosPercent: number;
  setCostosPercent: (value: number) => void;
  includeSolidarity: boolean;
  setIncludeSolidarity: (value: boolean) => void;
  currentMonth: Date;
}

const SocialSecurityCalculator: React.FC<SocialSecurityCalculatorProps> = ({
  totalIncome = 0,
  costosPercent = APP_CONFIG.DEFAULT_COSTOS_PERCENT,
  setCostosPercent,
  includeSolidarity = APP_CONFIG.DEFAULT_INCLUDE_SOLIDARITY,
  setIncludeSolidarity,
  currentMonth = new Date(),
}) => {
  const { direct, presumption } = calculateBothMethods(
    totalIncome,
    costosPercent,
    includeSolidarity
  );

  const formatCOP = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0';
    }
    return value.toLocaleString('es-CO');
  };

  const ensureDate = (dateValue: Date | string | undefined): Date => {
    if (!dateValue) {
      return new Date();
    }

    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue;
    }

    try {
      const parsed = new Date(dateValue.toString());
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse date:', dateValue);
    }

    return new Date();
  };

  const safeCurrentMonth = ensureDate(currentMonth);
  const monthDisplay = format(safeCurrentMonth, APP_CONFIG.DATE_FORMAT.MONTH_YEAR);

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const [copied, setCopied] = useState(false);
  const rawIBC = Math.ceil(presumption.base);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawIBC.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="calculator-container">
      <div className="summary-banner mb-4">
        <div className="summary-header">
          <h2>
            Social Security Summary for <span className="accent-text">{monthDisplay}</span>
          </h2>
          <p className="summary-subheader flex items-center flex-wrap gap-2">
            Based on your total income of {formatCOP(totalIncome)}, your recommended IBC is{' '}
            <span className="highlight fw-bold inline-flex items-center gap-1">
              {formatCOP(rawIBC)}
              <button
                onClick={handleCopy}
                title="Copy raw IBC value"
                className="copy-button"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </span>
          </p>
        </div>

        <div className="settings-controls">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="cost-percentage">Cost Percentage</Label>
                  <span className="text-primary font-medium">
                    {(costosPercent * 100).toFixed(2)}%
                  </span>
                </div>
                <Slider
                  id="cost-percentage"
                  min={0}
                  max={100}
                  step={0.01}
                  value={[costosPercent * 100]}
                  onValueChange={value => setCostosPercent(value[0] / 100)}
                />
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="flex items-center space-x-2 h-full">
                <Switch
                  id="include-solidarity"
                  checked={includeSolidarity}
                  onCheckedChange={setIncludeSolidarity}
                />
                <Label htmlFor="include-solidarity">Include Solidarity (1%)</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="calculation-result-cards grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="calculation-method method-direct">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h5 className="mb-0">Direct Method</h5>
                <div className="method-tag">40% Base</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="calculation-detail">
                <span>Base Amount</span>
                <span>{formatCOP(direct.base)}</span>
              </div>
              <div className="calculation-detail">
                <span>Health ({formatPercent(APP_CONFIG.FORMULA.HEALTH_PERCENTAGE)})</span>
                <span>{formatCOP(direct.health)}</span>
              </div>
              <div className="calculation-detail">
                <span>Pension ({formatPercent(APP_CONFIG.FORMULA.PENSION_PERCENTAGE)})</span>
                <span>{formatCOP(direct.pension)}</span>
              </div>
              {includeSolidarity && (
                <div className="calculation-detail">
                  <span>
                    Solidarity ({formatPercent(APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE)})
                  </span>
                  <span>{formatCOP(direct.solidarity)}</span>
                </div>
              )}
              <div className="calculation-total">
                <span>Total to Pay</span>
                <span>{formatCOP(direct.roundedTotal)}</span>
              </div>
              <div className="calculation-formula">
                <div className="formula-badge mt-3">
                  <div className="formula-icon">∑</div>
                  <div className="formula-text">
                    <code>
                      Base = {formatPercent(APP_CONFIG.FORMULA.BASE_PERCENTAGE)} × Total Income
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="calculation-method method-presumption">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h5 className="mb-0">Presumption of Costs</h5>
                <div className="method-tag">Cost Method</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="calculation-detail">
                <span>Base Amount</span>
                <span>{formatCOP(presumption.base)}</span>
              </div>
              <div className="calculation-detail">
                <span>Health ({formatPercent(APP_CONFIG.FORMULA.HEALTH_PERCENTAGE)})</span>
                <span>{formatCOP(presumption.health)}</span>
              </div>
              <div className="calculation-detail">
                <span>Pension ({formatPercent(APP_CONFIG.FORMULA.PENSION_PERCENTAGE)})</span>
                <span>{formatCOP(presumption.pension)}</span>
              </div>
              {includeSolidarity && (
                <div className="calculation-detail">
                  <span>
                    Solidarity ({formatPercent(APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE)})
                  </span>
                  <span>{formatCOP(presumption.solidarity)}</span>
                </div>
              )}
              <div className="calculation-total">
                <span>Total to Pay</span>
                <span>{formatCOP(presumption.roundedTotal)}</span>
              </div>
              <div className="calculation-formula">
                <div className="formula-badge mt-3">
                  <div className="formula-icon">∑</div>
                  <div className="formula-text">
                    <code>
                      Base = {formatPercent(APP_CONFIG.FORMULA.BASE_PERCENTAGE)} × Income × (1 -{' '}
                      {formatPercent(costosPercent)})
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="formula-explanation mt-5">
        <h6>How it works</h6>
        <p>
          Colombian social security for independent contractors can be calculated using two methods:
        </p>

        <div className="method-comparison mt-4">
          <div className="method-box">
            <h6>Direct Method</h6>
            <p>
              Takes {formatPercent(APP_CONFIG.FORMULA.BASE_PERCENTAGE)} of your total income as the
              base for calculation.
            </p>
            <div className="formula-code">
              Base = {formatPercent(APP_CONFIG.FORMULA.BASE_PERCENTAGE)} × Total Income
            </div>
          </div>

          <div className="method-box">
            <h6>Presumption of Costs Method</h6>
            <p>Applies a cost percentage to your income before calculating the base.</p>
            <div className="formula-code">
              Base = {formatPercent(APP_CONFIG.FORMULA.BASE_PERCENTAGE)} × (Income × (1 - Cost%))
            </div>
          </div>
        </div>

        <p className="mt-4 mb-3">From the base amount, these contributions are calculated:</p>
        <ul className="contributions-list">
          <li>
            Health: <code>{formatPercent(APP_CONFIG.FORMULA.HEALTH_PERCENTAGE)}</code> of base
          </li>
          <li>
            Pension: <code>{formatPercent(APP_CONFIG.FORMULA.PENSION_PERCENTAGE)}</code> of base
          </li>
          {includeSolidarity && (
            <li>
              Solidarity: <code>{formatPercent(APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE)}</code> of
              base
            </li>
          )}
        </ul>

        <div className="rounded-note mt-4">
          <div className="note-icon">💡</div>
          <div className="note-text">
            <p className="mb-0">
              The final amount is rounded up to the nearest {APP_CONFIG.ROUNDING.UNIT} COP as
              required by law. Always choose the method that results in the lower payment.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="method-comparison-table">
        <h6 className="comparison-table-header">Methods Comparison</h6>
        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Base Amount</th>
                <th>Health ({formatPercent(APP_CONFIG.FORMULA.HEALTH_PERCENTAGE)})</th>
                <th>Pension ({formatPercent(APP_CONFIG.FORMULA.PENSION_PERCENTAGE)})</th>
                {includeSolidarity && (
                  <th>Solidarity ({formatPercent(APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE)})</th>
                )}
                <th>Total to Pay</th>
              </tr>
            </thead>
            <tbody>
              <tr className="direct-row">
                <td>
                  <strong>Direct Method</strong>
                </td>
                <td>{formatCOP(direct.base)}</td>
                <td>{formatCOP(direct.health)}</td>
                <td>{formatCOP(direct.pension)}</td>
                {includeSolidarity && <td>{formatCOP(direct.solidarity)}</td>}
                <td className="total-column">{formatCOP(direct.roundedTotal)}</td>
              </tr>
              <tr className="presumption-row">
                <td>
                  <strong>Presumption of Costs</strong>
                </td>
                <td>{formatCOP(presumption.base)}</td>
                <td>{formatCOP(presumption.health)}</td>
                <td>{formatCOP(presumption.pension)}</td>
                {includeSolidarity && <td>{formatCOP(presumption.solidarity)}</td>}
                <td className="total-column">{formatCOP(presumption.roundedTotal)}</td>
              </tr>
              <tr className="difference-row">
                <td>
                  <strong>Difference</strong>
                </td>
                <td>{formatCOP(Math.abs(direct.base - presumption.base))}</td>
                <td>{formatCOP(Math.abs(direct.health - presumption.health))}</td>
                <td>{formatCOP(Math.abs(direct.pension - presumption.pension))}</td>
                {includeSolidarity && (
                  <td>{formatCOP(Math.abs(direct.solidarity - presumption.solidarity))}</td>
                )}
                <td className="total-column">
                  {formatCOP(Math.abs(direct.roundedTotal - presumption.roundedTotal))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SocialSecurityCalculator;
