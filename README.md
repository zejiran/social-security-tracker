# Social Security Tracker

A web application to automate the management of contractor payments and social security calculations for independent contractors.

## Overview

This application helps you track your monthly income as a contractor and automatically calculates your social security contributions based on Colombian regulations. It features:

- Management of recurring income items
- Automatic TRM (Colombian Peso exchange rate) fetching
- USD to COP conversion
- Social security calculations using both direct and presumption of costs methods
- Data persistence using local storage
- Export to Excel functionality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/social-security-tracker.git
cd social-security-tracker
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Settings

First, configure your recurring income items in the Settings tab. These are the income sources that will be pre-filled each month. For each item, you can set:

- Name of the income item
- Default USD amount
- Default cost percentage

### 2. Monthly Income

In the Income tab:

1. Select the month for which you want to record income
2. Enter the USD amounts for each item
3. Set the date for each entry
4. Click "Fetch TRM" to automatically get the exchange rate for that date
5. Review the calculated COP amounts and total

### 3. Social Security Calculation

In the Social Security tab:

1. View your total income in COP
2. Adjust the cost percentage if needed
3. Toggle the solidarity contribution option
4. Review the calculations for both methods:
   - Direct Method: 40% of total income as the base
   - Presumption of Costs: 40% of income after applying costs percentage
5. See the final amount you need to pay

### 4. Export Data

Click the "Export to Excel" button to download an Excel file with all your data for the selected month. The file includes both the income entries and the social security calculations.

## Building for Production

To create a production build:

```
npm run build
```

The build files will be in the `build` directory and can be deployed to any static hosting service.

## Deployment to Cloudflare Pages

This application can be easily deployed using Cloudflare Pages:

1. Push your code to a GitHub repository
2. In Cloudflare Dashboard, go to Pages and connect your repository
3. Configure the build settings:
   - Framework preset: Create React App
   - Build command: npm run build
   - Build output directory: build

## Local Data Storage

All data is stored locally in your browser using IndexedDB (via LocalForage). Data is never sent to a server, ensuring your financial information remains private.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.