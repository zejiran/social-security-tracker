# Social Security Tracker - Setup Guide

## Project Structure Overview

```
social-security-tracker/
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── IncomeTable.js             # Income entries table
│   │   ├── SettingsPanel.js           # Settings configuration
│   │   └── SocialSecurityCalculator.js # Social security calculations
│   ├── utils/             # Utility functions
│   │   ├── exportService.js           # Excel export functionality
│   │   ├── storageService.js          # LocalStorage persistence
│   │   └── trmService.js              # TRM fetching service
│   ├── App.js             # Main application component
│   └── index.js           # Entry point
└── package.json           # Dependencies
```

## Setup Instructions

### Development Environment Setup

1. **Node.js Installation**
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/) (v14.x or higher)
   - Verify installation with: `node -v` and `npm -v`

2. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/yourusername/social-security-tracker.git
   cd social-security-tracker
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   The application will run at [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Option 1: Cloudflare Pages (Recommended)

1. Push the code to your GitHub repository
2. Sign in to Cloudflare Dashboard
3. Navigate to Pages > Create a project
4. Connect your GitHub repository
5. Configure with these settings:
   - Build command: `npm run build`
   - Build output directory: `build`
   - Framework preset: Create React App
6. Deploy

#### Option 2: Manual Deployment

1. Create a production build:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `build` folder to any static hosting service like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3

## Configuration

### TRM Fetching

The application is configured to fetch the TRM (COP to USD exchange rate) from:
```
https://www.dolar-colombia.com/YYYY-MM-DD
```

If this service becomes unavailable, you can modify the `fetchTRM` function in `src/utils/trmService.js` to use a different source.

### Local Storage

The application stores all data in your browser's localStorage through the localforage library. This means:

- Data is persistent between sessions
- No server needed
- Data remains private on your device

To reset all data, you can use the browser's developer tools to clear localStorage.

## Key Features

1. **Recurring Income Items**
   - Define default items once
   - Set default USD values
   - Automatically populate monthly entry forms

2. **TRM Automation**
   - Automatic fetching of exchange rates
   - USD to COP conversion

3. **Social Security Calculation**
   - Both Direct and Presumption methods
   - Support for variable cost percentages
   - Optional solidarity contribution

4. **Excel Export**
   - Complete report generation
   - Formatted similarly to your original spreadsheets

## Technical Note

The application uses web scraping to fetch TRM values from dolar-colombia.com. If the website structure changes, you may need to update the scraping logic in `trmService.js`.