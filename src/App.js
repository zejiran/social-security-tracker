import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import './App.css';
import SettingsPanel from './components/SettingsPanel';
import IncomeTable from './components/IncomeTable';
import SocialSecurityCalculator from './components/SocialSecurityCalculator';
import { fetchTRM } from './utils/trmService';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storageService';
import { exportToExcel } from './utils/exportService';

function App() {
  // Default recurring items
  const defaultItems = [
    { id: 1, name: 'Payment (1- 15)', defaultUSD: 0 },
    { id: 2, name: 'Payment (16 - 30)', defaultUSD: 0 },
    { id: 3, name: 'Reembolso deportivo', defaultUSD: 0 },
    { id: 4, name: 'Reembolso internet', defaultUSD: 0 },
    { id: 5, name: 'Medicamentos Seguro', defaultUSD: 0 }
  ];

  // State variables
  const [recurringItems, setRecurringItems] = useState(
    loadFromLocalStorage('recurringItems') || defaultItems
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [costosPercent, setCostosPercent] = useState(
    loadFromLocalStorage('costosPercent') || 0.25
  );
  const [includeSolidarity, setIncludeSolidarity] = useState(
    loadFromLocalStorage('includeSolidarity') || false
  );
  const [activeTab, setActiveTab] = useState('income');
  const [totalCOP, setTotalCOP] = useState(0);

  // Load month data when current month changes
  useEffect(() => {
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    const savedEntries = loadFromLocalStorage(`entries-${monthKey}`) || [];
    
    if (savedEntries.length > 0) {
      setIncomeEntries(savedEntries);
    } else {
      // Create new entries from recurring items
      const newEntries = recurringItems.map(item => ({
        itemId: item.id,
        name: item.name,
        usd: item.defaultUSD,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
        trm: 0,
        cop: 0
      }));
      setIncomeEntries(newEntries);
    }
  }, [currentMonth, recurringItems]);

  // Calculate total COP whenever income entries change
  useEffect(() => {
    const total = incomeEntries.reduce((sum, entry) => sum + (entry.cop || 0), 0);
    setTotalCOP(total);
  }, [incomeEntries]);

  // Save data to local storage when it changes
  useEffect(() => {
    saveToLocalStorage('recurringItems', recurringItems);
    saveToLocalStorage('costosPercent', costosPercent);
    saveToLocalStorage('includeSolidarity', includeSolidarity);
    
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    saveToLocalStorage(`entries-${monthKey}`, incomeEntries);
  }, [recurringItems, costosPercent, includeSolidarity, incomeEntries, currentMonth]);

  // Update TRM for an entry
  const updateTRM = async (entryIndex, date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const trm = await fetchTRM(formattedDate);
      
      setIncomeEntries(prevEntries => {
        const newEntries = [...prevEntries];
        newEntries[entryIndex] = {
          ...newEntries[entryIndex],
          trm,
          cop: newEntries[entryIndex].usd * trm
        };
        return newEntries;
      });
    } catch (error) {
      console.error("Error fetching TRM:", error);
    }
  };

  // Update entry field
  const handleEntryChange = (entryIndex, field, value) => {
    setIncomeEntries(prevEntries => {
      const newEntries = [...prevEntries];
      newEntries[entryIndex] = {
        ...newEntries[entryIndex],
        [field]: value
      };
      
      // If USD or TRM changed, recalculate COP
      if (field === 'usd' || field === 'trm') {
        newEntries[entryIndex].cop = newEntries[entryIndex].usd * newEntries[entryIndex].trm;
      }
      
      return newEntries;
    });
  };

  // Update recurring item
  const handleRecurringItemChange = (itemId, field, value) => {
    setRecurringItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });
    });
  };

  // Add new recurring item
  const addRecurringItem = () => {
    const newId = Math.max(0, ...recurringItems.map(item => item.id)) + 1;
    setRecurringItems([...recurringItems, { id: newId, name: 'New Item', defaultUSD: 0 }]);
  };

  // Remove recurring item
  const removeRecurringItem = (itemId) => {
    setRecurringItems(recurringItems.filter(item => item.id !== itemId));
  };

  // Handle month change
  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  // Export current data to Excel
  const handleExport = () => {
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    exportToExcel(incomeEntries, totalCOP, costosPercent, includeSolidarity, monthName);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Social Security Tracker</h1>
        </Col>
      </Row>
      
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="income" title="Income">
          <IncomeTable 
            entries={incomeEntries} 
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            onEntryChange={handleEntryChange}
            onTRMFetch={updateTRM}
            onExport={handleExport}
            totalCOP={totalCOP}
          />
        </Tab>
        <Tab eventKey="socialSecurity" title="Social Security">
          <SocialSecurityCalculator 
            totalIncome={totalCOP}
            costosPercent={costosPercent}
            setCostosPercent={setCostosPercent}
            includeSolidarity={includeSolidarity}
            setIncludeSolidarity={setIncludeSolidarity}
            currentMonth={currentMonth}
          />
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <SettingsPanel 
            recurringItems={recurringItems}
            onItemChange={handleRecurringItemChange}
            onAddItem={addRecurringItem}
            onRemoveItem={removeRecurringItem}
            costosPercent={costosPercent}
            setCostosPercent={setCostosPercent}
            includeSolidarity={includeSolidarity}
            setIncludeSolidarity={setIncludeSolidarity}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;