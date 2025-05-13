import { Plus, GripVertical, X } from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { Button } from '../components/ui/button';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { APP_CONFIG } from '../config';
import { RecurringItem } from '../types';

interface SettingsPanelProps {
  recurringItems: RecurringItem[];
  onItemChange: (itemId: number, field: string, value: string | number | boolean) => void;
  onReorderItems: (newOrder: RecurringItem[]) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: number) => void;
  costosPercent: number;
  setCostosPercent: (value: number) => void;
  includeSolidarity: boolean;
  setIncludeSolidarity: (value: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  recurringItems = [],
  onItemChange,
  onReorderItems,
  onAddItem,
  onRemoveItem,
  costosPercent,
  setCostosPercent,
  includeSolidarity,
  setIncludeSolidarity,
}) => {
  const safeItems = React.useMemo(
    () => (Array.isArray(recurringItems) ? recurringItems : []),
    [recurringItems]
  );

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggingId(id);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((id: number) => {
    setDragOverId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (targetId: number) => {
      if (draggingId === null || draggingId === targetId) {
        return;
      }

      const dragItemIndex = safeItems.findIndex(item => item.id === draggingId);
      const dropItemIndex = safeItems.findIndex(item => item.id === targetId);

      if (dragItemIndex === -1 || dropItemIndex === -1) {
        return;
      }

      const newItems = [...safeItems];
      const [removed] = newItems.splice(dragItemIndex, 1);
      newItems.splice(dropItemIndex, 0, removed);

      onReorderItems(newItems);

      setDraggingId(null);
      setDragOverId(null);
    },
    [draggingId, safeItems, onReorderItems]
  );

  return (
    <div>
      <div className="settings-intro pt-4">
        <h3>Application Settings</h3>
        <p className="text-secondary fw-medium">
          Configure your recurring income items and calculation preferences. These settings will be
          saved automatically.
        </p>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <h4>Recurring Income Items</h4>
          <p className="text-secondary fw-medium">
            Define the income items that will appear each month.
          </p>
        </div>

        <div className="recurring-items-list">
          {safeItems.length === 0 ? (
            <div className="empty-items-message">
              <div className="empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <path d="M13 2v7h7"></path>
                </svg>
              </div>
              <p>
                No recurring income items defined yet. Click the button below to add your first
                item.
              </p>
            </div>
          ) : (
            safeItems.map(item => (
              <div
                className={`recurring-item-row ${draggingId === item.id ? 'dragging' : ''}`}
                key={item.id}
                draggable={true}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter(item.id)}
                onDragEnd={handleDragEnd}
                onDrop={() => handleDrop(item.id)}
                style={{
                  borderTop: dragOverId === item.id ? '2px solid var(--primary)' : undefined,
                }}
              >
                <div className="item-drag-handle">
                  <GripVertical size={16} />
                </div>

                <div className="item-name-field">
                  <Input
                    type="text"
                    value={item.name || ''}
                    onChange={e => onItemChange(item.id, 'name', e.target.value)}
                    placeholder="Item name"
                    className="h-8 text-sm rounded-md"
                  />
                </div>

                <div className="item-amount-field">
                  <div className="flex">
                    <div className="inline-flex items-center justify-center rounded-l-md border border-muted-foreground px-2 text-sm">
                      USD
                    </div>
                    <Input
                      type="number"
                      value={item.defaultUSD || ''}
                      onChange={e =>
                        onItemChange(item.id, 'defaultUSD', Number(e.target.value) || 0)
                      }
                      placeholder="Default value"
                      className="h-8 border-l-0 text-sm rounded-r-md"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Remove item"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}

          <Button onClick={onAddItem} className="add-item-btn">
            <Plus size={16} />
            <span className="ms-2">Add New Item</span>
          </Button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <h4>Calculation Settings</h4>
          <p className="text-secondary fw-medium">
            Configure the parameters used for social security calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Card className="settings-card mb-4">
              <CardHeader>
                <h5 className="mb-0">Default Cost Percentage</h5>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-white">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="percentage-value">Percentage Value</Label>
                    <span className="text-primary font-bold">
                      {(costosPercent * 100).toFixed(2)}%
                    </span>
                  </div>
                  <Slider
                    id="percentage-value"
                    min={0}
                    max={100}
                    step={0.01}
                    value={[costosPercent * 100]}
                    onValueChange={value => setCostosPercent(value[0] / 100)}
                  />
                  <p className="text-muted-foreground text-sm">
                    This is used for the &quot;Presumption of Costs&quot; calculation method. A
                    higher percentage typically results in lower social security payments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="settings-card mb-4">
              <CardHeader>
                <h5 className="mb-0">Solidarity Contribution</h5>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="default-solidarity"
                      checked={includeSolidarity}
                      onCheckedChange={setIncludeSolidarity}
                    />
                    <Label htmlFor="default-solidarity">
                      Include Solidarity Contribution (1%) by default
                    </Label>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    When enabled, the 1% solidarity contribution will be included in calculations
                    automatically. You can change this on a per-month basis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="settings-card">
          <CardHeader>
            <h5 className="mb-0">Formula Settings</h5>
          </CardHeader>
          <CardContent>
            <p className="text-secondary fw-medium mb-4">
              These are the configured formulas used for social security calculations.
            </p>

            <div className="formula-settings">
              <div className="formula-setting w-full">
                <div className="flex flex-col w-full">
                  <div className="formula-label">Base Percentage</div>
                  <div className="formula-value">{APP_CONFIG.FORMULA.BASE_PERCENTAGE * 100}%</div>
                  <div className="formula-description">
                    Of total income (after costs for presumption method)
                  </div>
                </div>
              </div>
              <div className="formula-setting w-full">
                <div className="flex flex-col w-full">
                  <div className="formula-label">Health Contribution</div>
                  <div className="formula-value">{APP_CONFIG.FORMULA.HEALTH_PERCENTAGE * 100}%</div>
                  <div className="formula-description">Of the calculated base amount</div>
                </div>
              </div>
              <div className="formula-setting w-full">
                <div className="flex flex-col w-full">
                  <div className="formula-label">Pension Contribution</div>
                  <div className="formula-value">
                    {APP_CONFIG.FORMULA.PENSION_PERCENTAGE * 100}%
                  </div>
                  <div className="formula-description">Of the calculated base amount</div>
                </div>
              </div>
              <div className="formula-setting w-full">
                <div className="flex flex-col w-full">
                  <div className="formula-label">Solidarity Contribution</div>
                  <div className="formula-value">
                    {APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE * 100}%
                  </div>
                  <div className="formula-description">Optional, based on your settings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="settings-footer">
        <p className="text-secondary fw-medium">
          <small>
            All settings are automatically saved in your browser. No data is sent to any server.
          </small>
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
