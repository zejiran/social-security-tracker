# Social Security Tracker

A modern TypeScript application for tracking contractor income and automating Colombian social security contribution calculations.

![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.6-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000000?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAA+klEQVR4nO2XUQqDMBBE32b3Dp7B0+UMngGvUPwoxVKkSGP3JbFYNwH9SdtpmOeHgTDDN0rC/wEAS7U8UpCqpWpzBnT9ub37LwtQ10cKIAmvjyQAr3kcBzDPKNKYJ/qOa3UPsC+AgryPTw3U9A2MArhyWg9Z9LwDzAK87CcATJHDrmkFaBzA9f9xgQKdd30/2BdQoIuhBqZIT+fzBchgXQBrsB6ANTCdnzSQQA0cI9gE2VgPQBva+nCSDiAPwHVXr4FpHdgXUFAGF+FoIPMdrAuQwboA1mA9AA3u62AtRAMai5DRFdR1pQbkyr+OeD99VVsKMvyt2tLnCX4ByycLiTuQ8uIAAAAASUVORK5CYII=)

<div align="center">
  <img src="public/logo.svg" alt="Social Security Tracker" height="180" width="180" style="margin: 20px 0;">
  <h3>💳 Simplify your contractor finances with powerful automation</h3>
</div>

## ✨ Features

- **💰 Income Management**: Track recurring income items in USD with automatic TRM conversion
- **💱 TRM Integration**: Automatically fetch Colombian Peso exchange rates from dolar-colombia.com
- **🧮 Smart Calculations**: Calculate contributions using both direct and presumption of costs methods
- **🔒 Local Storage**: Store your data securely in your browser with IndexedDB
- **📊 Excel Export**: Generate professional Excel reports for your financial records
- **🌗 Light/Dark Mode**: Automatic theme switching based on your system preferences
- **📱 Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

<div align="center">
  <img src="https://via.placeholder.com/800x400/4361ee/FFFFFF?text=Social+Security+Tracker" alt="Social Security Tracker Screenshot" style="border-radius: 12px; box-shadow: 0 12px 24px rgba(0,0,0,0.2); margin: 20px 0;">
</div>

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Understanding the Calculations](#-understanding-the-calculations)
- [Technical Details](#-technical-details)
- [Project Structure](#-project-structure)
- [TypeScript Migration](#-typescript-migration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security & Privacy](#-security--privacy)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Getting Started in 2 Minutes
### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zejiran/social-security-tracker.git
   cd social-security-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser** at [http://localhost:3000](http://localhost:3000)

### Production Deployment

To create a production build:

```bash
npm run build
```

The build files will be in the `build` directory and can be deployed to any static hosting service.

#### Deployment Options

- **Cloudflare Pages** (Recommended): Connect to GitHub repo, set build command to `npm run build` and output directory to `build`
- **Netlify/Vercel**: Connect to GitHub repo and use default React settings
- **GitHub Pages**: Use `gh-pages` package for easy deployment
- **AWS S3/Amplify**: For AWS-based hosting solutions

### First-time Setup

1. Go to the **Settings** tab
2. Configure your recurring income items (these will be available each month)
3. Set default values for USD amounts
4. Configure your default cost percentage (for tax calculations)
5. Toggle the solidarity contribution option if needed

### Monthly Usage

1. Navigate to the **Income** tab
2. Select the month you want to work on
3. Enter your USD amounts
4. Select dates for each entry
5. Click "Fetch TRM" to get exchange rates
6. View COP values calculated automatically

### Social Security Calculation

1. Go to the **Social Security** tab
2. See both calculation methods (direct and presumption)
3. Adjust cost percentage if needed for the current month
4. View final rounded amount to pay

### Exporting Data

1. Click "Export to Excel" button in the Income tab
2. Save the file to your desired location
3. The Excel file contains both income entries and social security calculations

## 📥 Installation

### Detailed Installation Steps

1. **Check Node.js version**
   ```bash
   node -v # Should be v14.x or higher
   ```

2. **Clone the repository** (or download and extract the ZIP file):
   ```bash
   git clone https://github.com/zejiran/social-security-tracker.git
   cd social-security-tracker
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # OR if you prefer yarn
   yarn install
   ```

4. **Configure environment variables** (optional - defaults will work for most users):
   - Create a `.env` file in the root directory if you need to customize any settings

5. **Start the development server:**
   ```bash
   npm start
   ```

6. **Verify installation** by opening [http://localhost:3000](http://localhost:3000) in your browser.

## 🖥️ Usage Guide

### First-Time Setup

1. **Go to the Settings tab**
   - Configure your recurring income items (these will be available each month)
   - Set default values for USD amounts
   - Configure your default cost percentage (for tax calculations)
   - Toggle the solidarity contribution option if needed

### Monthly Workflow

1. **Navigate to the Income tab**
   - Select the month you want to work on
   - Enter your USD amounts for each income source
   - Select transaction dates
   - Click "Fetch TRM" to get exchange rates automatically
   - View COP values calculated based on the TRM

2. **Review the Social Security tab**
   - See both calculation methods (direct and presumption of costs)
   - Adjust cost percentage if needed for the current month
   - View the final rounded amount to pay
   - See which method is recommended (lowest payment amount)

3. **Export Your Data**
   - Click "Export to Excel" button in the Income tab
   - Save the generated file to your desired location
   - The Excel file contains both income entries and social security calculations

## 🧮 Understanding the Calculations

The app calculates Colombian social security contributions using two methods:

### 1. Direct Method

```
Base = 40% × Total Income
```

Contributions:
- Health: 12.5% of base
- Pension: 16% of base
- Solidarity: 1% of base (optional)

### 2. Presumption of Costs Method

```
Base = (Total Income - Costs) × 40%
```
where `Costs = Total Income × Cost%`

- Cost% is configurable in settings (default: 40%)
- Same contribution percentages apply as Direct Method

The app automatically recommends the method that results in the lowest legal payment.

## 🛠️ Technical Details

### Key Technologies

- **React 18**: Modern UI library with hooks and context
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind
- **Lucide React**: Beautiful, consistent icon library
- **Axios**: HTTP requests for data fetching
- **Cheerio**: HTML parsing for TRM extraction
- **LocalForage**: Enhanced local storage with IndexedDB
- **ExcelJS**: Excel file generation for reports
- **Date-fns**: Date manipulation and formatting

### TypeScript Benefits

This project was migrated from JavaScript to TypeScript to improve:

- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better autocomplete and documentation
- **Code Quality**: Enforced interfaces and type consistency
- **Maintainability**: Self-documenting code with clear interfaces

Key TypeScript features used:
- React component prop interfaces
- Custom type definitions for app data structures
- Generic types for utility functions
- Type guards for runtime safety

## 📁 Project Structure

```
social-security-tracker/
├── public/                # Static assets
│   ├── index.html                  # HTML entry point
│   └── logo.svg                    # App logo
├── src/
│   ├── components/        # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── switch.tsx          # Switch component
│   │   │   └── ...                 # Other UI components
│   │   ├── IncomeTable.tsx         # Income management table
│   │   ├── SettingsPanel.tsx       # Settings configuration
│   │   └── SocialSecurityCalculator.tsx # Calculation component
│   ├── contexts/          # React Context for state management
│   │   └── AppContext.tsx          # Application state context
│   ├── hooks/             # Custom React hooks
│   │   └── useAppState.ts          # Primary state management
│   ├── lib/               # Library code
│   │   └── utils.ts                # Utility functions for UI components
│   ├── utils/             # Utility functions
│   │   ├── __tests__/              # Unit tests
│   │   ├── trmService.ts           # TRM fetching
│   │   ├── calculations.ts         # Social security calculations
│   │   ├── exportService.ts        # Excel export
│   │   └── storageService.ts       # Local storage management
│   ├── types.ts           # TypeScript interfaces
│   ├── config.ts          # Application configuration
│   ├── App.tsx            # Main application
│   ├── globals.css        # Tailwind and shadcn/ui styles
│   ├── index.css          # Global styles
│   └── index.tsx          # Entry point
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── MIGRATION.md           # Migration notes from Bootstrap to shadcn/ui
└── package.json           # Dependencies and scripts
```

## 🔄 Migrations

This project has undergone two significant migrations to improve code quality, maintainability, and user interface design:

1. **JavaScript to TypeScript Migration**  
2. **Bootstrap to shadcn/ui Migration**

### TypeScript Migration Process

1. **Setup Configuration**:
   - Added TypeScript and required type definitions
   - Created `tsconfig.json` with appropriate settings
   - Added ESLint for TypeScript

2. **Defined Core Types**:
   - Defined interfaces for all data structures
   - Added prop types for all components
   - Created utility types for reuse

3. **Component Migration**:
   - Converted React components to TypeScript
   - Added proper typing for props, state, and events
   - Implemented generic components where appropriate

4. **Utility Function Migration**:
   - Added proper typing to all utility functions
   - Used generics for flexible, type-safe implementations
   - Added return type annotations

5. **Enhanced State Management**:
   - Created typed contexts with proper interfaces
   - Implemented custom hooks with TypeScript

### UI Framework Migration

1. **Bootstrap to shadcn/ui**:
   - Replaced Bootstrap components with shadcn/ui equivalents
   - Added Tailwind CSS for styling 
   - Set up component library infrastructure

2. **UI Components**:
   - Migrated Card, Table, Button components
   - Implemented Form controls (Input, Slider, Switch)
   - Added Tabs, Tooltip components
   - Switched layout from Bootstrap grid to Tailwind grid

3. **Icon System**:
   - Replaced manual SVG icons with Lucide React icons
   - Created custom icon components as needed

4. **Styling**:
   - Implemented theme variables with CSS custom properties
   - Added responsive design with Tailwind breakpoints
   - Migrated utility classes to Tailwind equivalents

### Advantages Realized

#### TypeScript Benefits
- **IDE Support**: Better autocomplete, refactoring, and navigation
- **Safer Refactoring**: Type checking prevents regressions during changes
- **Self-Documentation**: Types serve as living documentation
- **Bug Prevention**: Many bugs caught during development rather than runtime

#### UI Framework Benefits
- **Component Consistency**: Unified design language across the application
- **Accessibility**: Improved accessibility with Radix UI primitives
- **Performance**: Reduced bundle size compared to Bootstrap
- **Developer Experience**: Better composition patterns with React
- **Customization**: More granular control over styling with Tailwind
- **Icon System**: Consistent, scalable icons with Lucide React

### Type Definitions

Key type definitions in `src/types.ts` include:
- `RecurringItem`: For recurring income items configuration
- `IncomeEntry`: For monthly income entries with USD/COP values
- `SocialSecurityCalculation`: For social security calculation results
- `MonthlyData`: For storing monthly income and calculation data
- Various function types for props and callbacks

## 💻 Development

### Code Quality Tools

The project is set up with several code quality tools:

- **TypeScript**: For type safety and better developer experience
- **ESLint**: Linting to catch common issues
- **Prettier**: Code formatting for consistency

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Create production build
- `npm test`: Run tests
- `npm run lint`: Check for linting errors
- `npm run lint:fix`: Fix linting errors automatically
- `npm run format`: Format code using Prettier

## 🚢 Deployment

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `build` directory and can be deployed to any static hosting service.

### Recommended Deployment: Cloudflare Pages

1. Push your code to a GitHub repository
2. In Cloudflare Dashboard, go to Pages and connect your repository
3. Configure the build settings:
   - Framework preset: Create React App
   - Build command: `npm run build`
   - Build output directory: build

### Alternative Deployment Options

The application can also be deployed to:
- **Netlify**: Connect to GitHub repo and set build command
- **Vercel**: Import repository and use default React settings
- **GitHub Pages**: Use `gh-pages` package for easy deployment
- **AWS S3/Amplify**: For AWS-based hosting solutions

## 🔒 Security & Privacy

### Data Storage

All data is stored locally in your browser using IndexedDB (via the LocalForage library). No information is sent to any server except when fetching TRM values.

Benefits of this approach:
- **Privacy**: Your financial data never leaves your device
- **Security**: No account or authentication needed
- **Accessibility**: Works offline after initial load
- **Simplicity**: No server-side infrastructure required

To reset all data, you can use your browser's developer tools (F12):
1. Go to Application > Storage > IndexedDB
2. Right-click on the database and select "Delete Database"

### TRM Fetching

The application fetches TRM (Colombian Peso to USD exchange rate) values from:
```
https://www.dolar-colombia.com/YYYY-MM-DD
```

Only the date is sent to the service; no personal or financial information is shared. The service uses web scraping to extract the TRM value from the page.

If the service becomes unavailable or the website structure changes, you can modify the `fetchTRM` function in `src/utils/trmService.ts` to use a different source. The system uses a default of 4000 COP per USD in case of errors.

## 🔧 Troubleshooting

### Common Issues

1. **TRM Fetching Issues**
   - **Cause**: The dolar-colombia.com site structure might change or be temporarily unavailable
   - **Solution**: Manually enter TRM values until the service is back online
   - **Default Fallback**: The system uses a default of 4000 COP per USD if TRM fetching fails

2. **Data Reset**
   - **Cause**: You need to clear all data and start fresh
   - **Solution**: Use browser's developer tools (F12) > Application > Storage > IndexedDB > Right-click on the database and delete

3. **Date Parsing Issues**
   - **Cause**: Manually typed dates might use incorrect format
   - **Solution**: Always use the date picker component for date selection

4. **Import/Export Issues**
   - **Cause**: Excel export might fail if using an unsupported browser
   - **Solution**: Use Chrome, Firefox, or Edge for optimal compatibility

### Getting Help

If you encounter any issues not covered here:
- Check the [GitHub Issues](https://github.com/zejiran/social-security-tracker/issues) for similar problems
- Create a new issue with detailed information about the problem

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Make your changes and ensure they pass linting: `npm run lint`
5. Format your code: `npm run format`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>
    <strong>Social Security Tracker</strong> • Made with ❤️ for independent contractors
  </p>
  <p>
    <a href="https://github.com/zejiran/social-security-tracker">GitHub</a> •
    <a href="https://github.com/zejiran/social-security-tracker/issues">Report Bug</a> •
    <a href="https://github.com/zejiran/social-security-tracker/issues">Request Feature</a>
  </p>
</div>
