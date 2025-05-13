import { Calculator, DollarSign, HexagonIcon, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import './App.css';
import IncomeTable from './components/IncomeTable';
import SettingsPanel from './components/SettingsPanel';
import SocialSecurityCalculator from './components/SocialSecurityCalculator';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { AppProvider, useAppContext } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('income');
  const {
    recurringItems,
    currentMonth,
    incomeEntries,
    costosPercent,
    includeSolidarity,
    totalCOP,
    setCurrentMonth,
    handleEntryChange,
    handleRecurringItemChange,
    reorderRecurringItems,
    reorderIncomeEntries,

    addRecurringItem,
    removeRecurringItem,
    addIncomeEntry,
    removeIncomeEntry,
    setCostosPercent,
    setIncludeSolidarity,
    updateTRM,
    exportCurrentMonth,
  } = useAppContext();

  return (
    <div className="app-container fade-in">
      <header className="app-header">
        <h1 className="app-title">
          <Calculator className="mr-2" size={24} /> Social Security Tracker
        </h1>
        <div className="header-actions">
          <Badge variant="secondary" className="current-month pulse-animation text-sm px-3 py-1">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Badge>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 slide-up">
        <TabsList className="w-full flex justify-start mb-2">
          <TabsTrigger value="income" className="flex items-center gap-2">
            <DollarSign size={20} />
            <span>Income</span>
          </TabsTrigger>
          <TabsTrigger value="socialSecurity" className="flex items-center gap-2">
            <HexagonIcon size={20} />
            <span>Social Security</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={20} />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="fade-in" style={{ animationDelay: '0.1s' }}>
          <IncomeTable
            entries={incomeEntries}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onEntryChange={handleEntryChange}
            onTRMFetch={updateTRM}
            onExport={exportCurrentMonth}
            totalCOP={totalCOP}
            onReorderEntries={reorderIncomeEntries}
            onAddEntry={addIncomeEntry}
            onRemoveEntry={removeIncomeEntry}
          />
        </TabsContent>

        <TabsContent value="socialSecurity" className="fade-in" style={{ animationDelay: '0.15s' }}>
          <SocialSecurityCalculator
            totalIncome={totalCOP}
            costosPercent={costosPercent}
            setCostosPercent={setCostosPercent}
            includeSolidarity={includeSolidarity}
            setIncludeSolidarity={setIncludeSolidarity}
            currentMonth={currentMonth}
          />
        </TabsContent>

        <TabsContent value="settings" className="fade-in" style={{ animationDelay: '0.2s' }}>
          <SettingsPanel
            recurringItems={recurringItems}
            onItemChange={handleRecurringItemChange}
            onReorderItems={reorderRecurringItems}
            onAddItem={addRecurringItem}
            onRemoveItem={removeRecurringItem}
            costosPercent={costosPercent}
            setCostosPercent={setCostosPercent}
            includeSolidarity={includeSolidarity}
            setIncludeSolidarity={setIncludeSolidarity}
          />
        </TabsContent>
      </Tabs>

      <footer className="app-footer fade-in" style={{ animationDelay: '0.25s' }}>
        <p className="text-muted text-center">
          <small>
            © {new Date().getFullYear()} Social Security Tracker | All data is stored locally in
            your browser |{' '}
            <a
              href="https://github.com/zejiran/social-security-tracker"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'custom-toast',
          style: {
            border: '1px solid var(--border-color)',
            padding: '12px',
            color: 'var(--text-primary)',
            background: 'var(--background)',
          },
          success: {
            style: {
              background: 'var(--success)',
              color: 'white',
            },
          },
          error: {
            style: {
              background: 'var(--danger)',
              color: 'white',
            },
          },
          duration: 4000,
        }}
      />
      <AppContent />
    </AppProvider>
  );
};

export default App;
