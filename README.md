# Social Security Tracker

Track your contractor income and automate Colombian social security calculations.

![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.6-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000000?style=for-the-badge)

<div align="center">
  <img src="public/logo.svg" alt="Social Security Tracker" width="100">
  <h3>Your financial automation tool for contractors</h3>
</div>

## Features

- **Income Management**: Track recurring income in USD with automatic TRM conversion
- **TRM Integration**: Auto-fetch Colombian Peso exchange rates
- **Smart Calculations**: Calculate contributions using direct and presumption of costs methods
- **Local Storage**: Store data securely in your browser with IndexedDB
- **Excel Export**: Generate professional reports for financial records

<img src="https://github.com/user-attachments/assets/6260bb24-5bb8-4037-84e4-1c2be046da78" width="100%" alt="Screenshot 1" />
<div style="display: flex; gap: 10px; margin-top: 10px;">
<img src="https://github.com/user-attachments/assets/e06d2d9f-c886-48b2-bd1f-cef7d3f1fec7" style="width: 51%;" alt="Screenshot 2" /><img src="https://github.com/user-attachments/assets/479c945a-35e2-4958-8525-4725a2d859d0" style="width: 49%;" alt="Screenshot 3" />
</div>

## Quick Setup

```bash
# Install dependencies
npm install

# Start development server
npm dev
```

## Usage

### First-Time Setup

1. Navigate to the Settings tab
2. Add your recurring income sources
3. Configure your calculation preferences

### Monthly Workflow

1. Go to the Income tab and select the month
2. Enter USD amounts for each income source
3. Select transaction dates
4. Click "Fetch TRM" to get exchange rates (not available for future dates)
5. View COP values calculated automatically
6. Review the Social Security tab for contribution calculations

## Calculations

The app performs two calculation methods:

**1. Direct Method**
- Base calculation: 40% of income
- Health contribution: 12.5% of 40% of income
- Pension contribution: 16% of 40% of income
- Solidarity fund: Optional 1-2% if income exceeds 4 minimum wages

**2. Presumption of Costs Method**
- Uses a configurable percentage for presumed costs (default: 60%)
- Health contribution: 12.5% of income after costs
- Pension contribution: 16% of income after costs
- Solidarity fund: Applied if threshold is met

## Technical Details

- **Frontend**: React + TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Storage**: LocalForage (IndexedDB wrapper)
- **API Integration**: Axios for TRM fetching
- **Notifications**: React Hot Toast for user feedback
- **Exports**: ExcelJS for report generation

## Project Structure

```
social-security-tracker/
├── public/             # Static assets
├── src/                # Application source code
│   ├── components/     # React components
│   │   └── ui/         # UI component library
│   ├── contexts/       # React contexts
│   │   └── AppContext  # Main application state
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   │   ├── trmService.ts      # TRM fetching service
│   │   ├── exportService.ts   # Excel export
│   │   └── toastUtils.ts      # Toast notifications
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Entry point
└── package.json        # Dependencies
```

## Security & Privacy

All data is stored locally in your browser using IndexedDB. The application only sends requests to external services when fetching TRM values.

### TRM Fetching

- Exchange rates are fetched from `trm-colombia.vercel.app`
- Only the date is sent; no personal data is transmitted
- Future dates are automatically detected and won't trigger API calls
- Manual entry is provided when TRM fetching is unavailable

## Development

```bash
# Run linting
npm run lint

# Format code
npm run format

# Build production version
npm run build
```

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](LICENSE)**
- Copyright 2025 © Juan Alegría
