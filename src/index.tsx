import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global styles
import './globals.css';
import './index.css';
import App from './App';
import { TooltipProvider } from './components/ui/tooltip';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <TooltipProvider delayDuration={0}>
      <App />
    </TooltipProvider>
  </React.StrictMode>
);
