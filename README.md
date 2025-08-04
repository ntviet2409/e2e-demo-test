# OrangeHRM Test Automation Framework

A comprehensive end-to-end test automation framework for OrangeHRM using Playwright, TypeScript, and modern testing practices.

## Project Overview

This project provides automated testing capabilities for the OrangeHRM application, focusing on login functionality and sidebar search features. The framework is built with Playwright for reliable cross-browser testing, TypeScript for type safety, and includes comprehensive logging and reporting capabilities.

## Features

- **Cross-Platform Testing**: Desktop, Mobile, and Tablet support
- **Multi-Browser Support**: Chrome, Firefox, Safari, and Edge across platforms
- **TypeScript Support**: Full type safety and IntelliSense
- **Page Object Model**: Maintainable and reusable test structure
- **Comprehensive Logging**: Winston-based logging with file and console output
- **Parallel Test Execution**: Configurable parallel test runs (1-5 workers)
- **Screenshot and Video Capture**: Automatic capture on test failures
- **Environment Configuration**: Multi-environment support (dev, staging, production, CI)
- **CI/CD Ready**: Optimized for continuous integration pipelines
- **Detailed Reporting**: HTML and JUnit XML reports
- **Flexible Execution Modes**: Headed/headless, individual browsers, cross-browser

## Project Structure

```
submission/
├── src/
│   ├── actions/
│   │   └── pageObjects/
│   │       ├── basePage.ts           # Base page with cross-browser utilities
│   │       ├── dashboardPage.ts      # Dashboard page object
│   │       ├── loginPage.ts          # Login page object
│   │       └── searchPage.ts         # Search functionality page object
│   └── lib/
│       └── logger.ts                 # Winston-based logging configuration
├── tests/
│   ├── orangehrm-login.spec.ts      # Login functionality tests (5 test cases)
│   └── orangehrm-search.spec.ts     # Search functionality tests (10 test cases)
├── logs/                            # Application logs directory
│   ├── combined.log                 # All log messages
│   └── error.log                    # Error messages only
├── ui/                              # UI artifacts directory
├── playwright-report/               # HTML test reports and traces
├── test-results/                    # Test execution artifacts
├── .github/                         # GitHub Actions CI/CD workflows
├── Master Test Plan.xlsx            # Master test plan document
├── OrangeHRM_Professional_Test_Cases_v2.csv  # Test case specifications
├── .env.dev                         # Development environment variables
├── .env.ci                          # CI environment variables
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── .gitignore                       # Git ignore rules
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd submission
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Set up environment variables**
   
   Create environment-specific configuration files:
   
   - `.env.dev` (for development)
   - `.env.staging` (for staging)
   - `.env.production` (for production)
   
   Example `.env.dev`:
   ```env
   BASE_URL=https://opensource-demo.orangehrmlive.com
   ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com
   ORANGEHRM_USERNAME=Admin
   ORANGEHRM_PASSWORD=admin123
   LOG_LEVEL=info
   HEADLESS=true
   ```

## Configuration

### Playwright Configuration

The framework uses a sophisticated Playwright configuration (`playwright.config.ts`) with the following features:

- **Parallel Execution**: Configurable worker processes
- **Retry Logic**: Automatic retries for flaky tests
- **Timeout Management**: Optimized timeouts for different environments
- **Reporting**: Multiple reporter formats (HTML, JUnit XML, webhook)
- **Browser Configuration**: Desktop Chrome with Full HD viewport
- **Screenshot and Video**: Capture on failures for debugging

### TypeScript Configuration

The project uses TypeScript with the following configuration:

- **Target**: ES2020
- **Module Resolution**: Node.js
- **Path Mapping**: `@/*` maps to `src/*`
- **Strict Mode**: Enabled for type safety

## Available Scripts

### Test Execution Commands

#### Local Development

```bash
# Debug tests with Playwright UI
npm run debug

# Run all tests across all platforms
npm run test
# or
npm run test:all-platforms

# Cross-browser testing (Chrome, Firefox, Safari)
npm run test:cross-browser

# Individual browser testing
npm run test:chrome      # Chrome Desktop
npm run test:firefox     # Firefox Desktop
npm run test:safari      # Safari Desktop
npm run test:edge        # Edge Windows

# Mobile and tablet testing
npm run test:mobile      # Chrome Mobile + Safari Mobile
npm run test:tablet      # iPad Pro

# Headed vs Headless execution
npm run test:headed      # With browser UI (single worker)
npm run test:headless    # Without browser UI (2 workers)
```

#### CI/CD Pipeline Commands

```bash
# CI optimized execution (limited workers, max failures)
npm run test:ci

# CI sharded execution for parallel pipeline stages
npm run test:ci-sharded
```

#### Environment-Specific Execution

```bash
# Development environment (default) - uses .env.dev
ENV=dev npm run test

# CI environment - uses .env.ci
ENV=ci npm run test:ci

# Note: Create additional .env.staging, .env.production files as needed
# and they will be automatically loaded based on ENV variable
```

## Test Structure

### Test Categories

1. **Login Tests** (`orangehrm-login.spec.ts`) - 5 Test Cases
   - TC_LOGIN_001: Valid credentials authentication flow
   - TC_LOGIN_002: Invalid credentials error handling
   - TC_LOGIN_005: Empty fields client-side validation
   - TC_LOGIN_009: Password field security validation
   - TC_LOGIN_008: Session management and logout flow

2. **Search Tests** (`orangehrm-search.spec.ts`) - 10 Test Cases
   - TC_SEARCH_001: Exact match module filtering
   - TC_SEARCH_002: Partial match and substring search
   - TC_SEARCH_003: Case insensitive search validation
   - TC_SEARCH_004: No results and invalid input handling
   - TC_SEARCH_005: Clear and reset functionality
   - TC_SEARCH_006: Special characters and XSS prevention
   - TC_SEARCH_007: Performance with rapid input changes
   - TC_SEARCH_008: Multi-word module name handling
   - TC_SEARCH_009: Keyboard navigation and accessibility
   - TC_SEARCH_010: Search state persistence

### Test Case Specifications

The project includes a comprehensive test case specification file (`OrangeHRM_Professional_Test_Cases_v2.csv`) containing:

- **15 automated test cases** currently implemented (5 login + 10 search tests)
- **Detailed test steps** with selectors and expected results
- **Priority levels** and automation status
- **Environment specifications** for each test case
- **Master Test Plan.xlsx** with comprehensive test planning documentation

### Page Object Model

The framework implements the Page Object Model pattern with cross-browser compatibility:

- **Base Page Object** (`src/actions/pageObjects/basePage.ts`)
  - Cross-browser compatibility utilities
  - Platform detection (mobile/tablet/desktop)
  - Browser-specific click and fill methods
  - Responsive design handling
  - Cross-platform screenshot capabilities

- **Login Page Object** (`src/actions/pageObjects/loginPage.ts`)
  - Standard login functionality (username/password)
  - Error message validation
  - Form state verification
  - Client-side validation testing
  - Password field security validation

- **Dashboard Page Object** (`src/actions/pageObjects/dashboardPage.ts`)
  - Module navigation
  - User dropdown and logout functionality
  - Session management verification
  - Cross-module navigation testing

- **Search Page Object** (`src/actions/pageObjects/searchPage.ts`)
  - Sidebar search functionality
  - Module filtering and matching
  - Keyboard navigation and accessibility
  - Search state persistence testing

## Logging and Monitoring

### Logging Configuration

The framework uses Winston for comprehensive logging:

- **Console Output**: Colored, timestamped logs
- **File Logging**: Separate files for combined and error logs
- **Log Levels**: Configurable via `LOG_LEVEL` environment variable
- **Automatic Directory Creation**: Logs directory created if not exists

### Log Files

- `logs/combined.log`: All log messages (info level and above)
- `logs/error.log`: Error messages only
- Console output: Real-time colored logs

## Test Reports

### HTML Reports

After test execution, detailed HTML reports are generated in the `playwright-report/` directory, including:

- Test execution summary
- Screenshots of failed tests
- Video recordings (if enabled)
- Performance metrics
- Error details and stack traces

### JUnit XML Reports

For CI/CD integration, JUnit XML reports are generated in `playwright-report/report.xml`.

## Environment Management

### Multi-Environment Support

The framework supports multiple environments through environment-specific configuration files:

1. **Development** (`.env.dev`) - ✅ Available
2. **CI/CD** (`.env.ci`) - ✅ Available
3. **Staging** (`.env.staging`) - Create as needed
4. **Production** (`.env.production`) - Create as needed

### Environment Variables

Key environment variables:

- `BASE_URL`: Application base URL
- `ORANGEHRM_BASE_URL`: OrangeHRM specific base URL
- `ORANGEHRM_USERNAME`: Test username
- `ORANGEHRM_PASSWORD`: Test password
- `LOG_LEVEL`: Logging verbosity
- `HEADLESS`: Browser headless mode
- `ENV`: Environment selection

## Continuous Integration

### CI/CD Configuration

The framework is optimized for CI/CD pipelines with:

- **Semaphore CI Support**: Conditional HTML report generation
- **Parallel Execution**: Configurable worker processes
- **Retry Logic**: Automatic retries for flaky tests
- **Artifact Collection**: Screenshots, videos, and reports
- **Webhook Notifications**: Automatic test result notifications

### CI Environment Variables

```yaml
# Example CI configuration
ENV: ci
CI: true
WORKERS: 1
RETRIES: 1
TRACE: on
MAX_FAILURES: 5
```

## Cross-Platform & Browser Support

### Supported Platforms & Browsers

#### Desktop Browsers
- **Chrome Desktop**: 1920x1080 viewport, maximized window
- **Firefox Desktop**: 1920x1080 viewport, full cross-browser compatibility
- **Safari Desktop**: 1920x1080 viewport, macOS testing
- **Edge Desktop**: 1920x1080 viewport, Windows testing

#### Mobile Devices
- **Chrome Mobile**: Pixel 5 emulation
- **Safari Mobile**: iPhone 12 emulation

#### Tablet Devices
- **iPad Pro**: Full tablet experience testing

### Browser Configuration Features

- **Viewport**: Configurable per platform (Desktop: 1920x1080, Mobile: device-specific)
- **Device Scale Factor**: Platform-optimized scaling
- **Headless Mode**: Configurable via `HEADLESS` environment variable
- **Launch Arguments**: Platform-specific optimizations (maximized windows for desktop)
- **Parallel Execution**: 1-5 workers depending on environment and platform
- **Trace Collection**: On-demand or on-failure trace collection for debugging

## Dependencies

### Core Dependencies

- **@playwright/test**: Testing framework
- **typescript**: Type safety
- **winston**: Logging framework
- **dotenv**: Environment variable management

### Development Dependencies

- **@playwright/test**: Playwright testing framework (v1.46.0)
- **@types/node**: Node.js type definitions (v20.14.10)
- **typescript**: TypeScript compiler (v5.1.6)
- **dotenv**: Environment variable management (v16.4.7)

### Runtime Dependencies

- **winston**: Logging framework (v3.17.0)

## Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Environment File Missing**
   ```bash
   # Create environment file
   cp .env.example .env.dev
   ```

3. **Permission Issues**
   ```bash
   # Fix log directory permissions
   mkdir -p logs && chmod 755 logs
   ```

4. **Test Failures**
   - Check screenshots in `ui/screenshots/`
   - Review logs in `logs/` directory
   - Verify environment variables

### Debug Mode

For debugging test issues:

```bash
# Run tests with UI mode
npm run debug
```

This opens the Playwright UI for interactive debugging and step-by-step execution.

## Contributing

### Development Guidelines

1. **Code Style**: Follow TypeScript and ESLint rules
2. **Test Structure**: Use Page Object Model pattern
3. **Logging**: Include appropriate log statements
4. **Documentation**: Update test case specifications
5. **Environment**: Test across multiple environments

### Adding New Tests

1. Create test file in `tests/` directory
2. Follow existing naming convention
3. Use appropriate test tags
4. Include comprehensive logging
5. Add test cases to CSV specification

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review test logs and reports
3. Consult the test case specifications
4. Contact the development team

## Version History

- **v1.0.0**: Initial release with login and search functionality
- Comprehensive test coverage for OrangeHRM application
- Page Object Model implementation
- Multi-environment support
- CI/CD integration ready # Test commit to verify CI fix
