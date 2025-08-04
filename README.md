# Orange HRM Test Automation Framework

A comprehensive end-to-end test automation framework for OrangeHRM using Playwright, TypeScript, and modern testing practices.

## Project Overview

This project provides automated testing capabilities for the OrangeHRM demo application (https://opensource-demo.orangehrmlive.com), focusing on login functionality and sidebar search features. The framework is built with Playwright for reliable cross-browser testing, TypeScript for type safety, and includes comprehensive logging and reporting capabilities.

### Test Execution Summary

- **15 Unique Test Cases** written and maintained in the codebase
- **105 Total Test Executions** when run across all platforms (15 tests × 7 platform configurations)
- **7 Platform Configurations**: Chrome Desktop, Firefox Desktop, Safari Desktop, Edge Desktop, Chrome Mobile, Safari Mobile, iPad Pro

### Test Coverage Requirements

- **Functional Coverage**: 15 test cases (5 login + 10 search) covering critical user workflows
- **Browser Coverage**: Chrome, Firefox, Safari, and Edge across all major platforms
- **Platform Coverage**: Desktop (Windows/Mac/Linux), Mobile (iOS/Android), and Tablet devices
- **Environment Coverage**: Development, CI/CD, Staging, and Production configurations
- **Edge Cases**: XSS prevention, special characters, performance under load, accessibility

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
specifications
├── .env.dev                         # Development environment variables
├── .env.ci                          # CI environment variables
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── .gitignore                       # Git ignore rules
```

## Prerequisites

### System Requirements

- **Node.js**: v16 or higher (v18 recommended for CI/CD)
- **Package Manager**: npm (v8+) or yarn (v1.22+)
- **Memory**: Minimum 4GB RAM (8GB recommended for parallel execution)
- **Disk Space**: 2GB free space for browsers and test artifacts
- **Operating Systems**: 
  - Windows 10/11
  - macOS 11+ (Big Sur or later)
  - Ubuntu 20.04+ / Debian 10+
  - Other Linux distributions with modern browsers support

## Quick Start Guide

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/ntviet2409/e2e-demo-test.git
cd e2e-demo-test

# Install dependencies
npm ci  # Use 'ci' for exact dependency versions

# Install Playwright browsers with system dependencies
npx playwright install --with-deps

# Verify installation
npx playwright --version
```

### 2. Environment Configuration
   
Create environment files based on your needs:

```bash
# Development environment (included in repo)
cp .env.dev.example .env.dev  # If example exists
# OR use the provided .env.dev directly

# CI environment (included in repo)
# .env.ci is pre-configured for GitHub Actions

# Create additional environments as needed
cp .env.dev .env.staging
cp .env.dev .env.production
```

**Environment Variables Reference:**

```env
# Application Configuration
BASE_URL=https://opensource-demo.orangehrmlive.com
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com
ORANGEHRM_USERNAME=Admin
ORANGEHRM_PASSWORD=admin123

# Test Execution Configuration
HEADLESS=true                 # true/false - Browser visibility
WORKERS=4                      # 1-5 - Parallel test workers
RETRIES=1                      # 0-2 - Test retry attempts
TRACE=on                       # on/off/on-first-retry - Trace collection
MAX_FAILURES=0                 # 0 for unlimited, >0 to stop after N failures

# Logging Configuration
LOG_LEVEL=info                 # error/warn/info/debug

# CI-Specific Variables
CI=true                        # Set automatically in CI environments
ENV=ci                         # Environment name (dev/ci/staging/production)
```

### 3. Quick Test Run

```bash
# Run all tests with default configuration
npm test

# Run tests with UI for debugging
npm run debug

# Run specific browser tests
npm run test:chrome
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

## Test Reports & Coverage

### Test Coverage Metrics

#### Current Test Coverage
- **Unique Test Cases**: 15 automated tests (5 login + 10 search)
- **Total Test Executions**: 105 per full run (15 tests × 7 platforms)
- **Login Module**: 5 test cases × 7 platforms = 35 executions
- **Search Module**: 10 test cases × 7 platforms = 70 executions
- **Browser Coverage**: 4 browsers across 7 configurations
- **Platform Coverage**: Desktop (4), Mobile (2), Tablet (1)

```
[INFO] See TEST_TRACEABILITY_MATRIX.md for detailed test execution breakdown
```

#### Coverage Areas

| Module | Test Cases | Coverage Type | Status |
|--------|------------|---------------|--------|
| Login | 5 | Functional, Security, Validation | [PASS] Complete |
| Search | 10 | Functional, Performance, Accessibility | [PASS] Complete |

### Test Reports

#### HTML Reports

Detailed HTML reports in `playwright-report/` include:

- **Summary Dashboard**: Pass/fail statistics, duration metrics
- **Test Details**: Step-by-step execution logs
- **Visual Evidence**: Screenshots and videos of failures
- **Performance Metrics**: Load times, response times
- **Error Analysis**: Stack traces, error messages
- **Traces**: Interactive debugging for failed tests

**Sample HTML Report Interface:**

The Playwright HTML report provides a comprehensive view of test execution across all platforms:

```
┌─────────────────────────────────────────────────────────────────┐
│ Playwright Test Report - OrangeHRM Test Automation             │
├─────────────────────────────────────────────────────────────────┤
│ All: 120  Passed: 120  Failed: 0  Flaky: 0  Skipped: 0        │
│ Total Time: 12.1m                        Date: 8/4/2025 12:00   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Test Execution Results by Platform:                            │
│                                                                 │
│ [Chrome Desktop] Login Tests                                   │
│ ├─ TC_LOGIN_001: Valid Credentials           [3.4s] [PASS]     │
│ ├─ TC_LOGIN_002: Invalid Credentials         [2.6s] [PASS]     │
│ ├─ TC_LOGIN_005: Empty Fields Validation     [1.1s] [PASS]     │
│ ├─ TC_LOGIN_009: Password Security           [1.5s] [PASS]     │
│ └─ TC_LOGIN_008: Session Management          [10.0s] [PASS]    │
│                                                                 │
│ [Firefox Desktop] Login Tests                                  │
│ ├─ TC_LOGIN_001: Valid Credentials           [4.0s] [PASS]     │
│ ├─ ... (similar pattern)                                       │
│                                                                 │
│ [Additional platforms: Safari, Edge, Mobile, Tablet...]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Viewing Reports:**

```bash
# View HTML report after test run
npx playwright show-report

# Serve report on specific port
npx playwright show-report --port 9323
```

**Report Features:**

- Interactive test filtering by status, platform, and duration
- Expandable test details with step-by-step execution logs
- Click-through navigation to view traces, screenshots, and videos
- Real-time test execution metrics and performance data
- Cross-platform comparison views

#### JUnit XML Reports

For CI/CD integration:
- Location: `playwright-report/report.xml`
- Format: JUnit XML compatible with most CI tools
- Contents: Test suites, cases, failures, errors

#### Custom Reporting

Access test results programmatically:

```bash
# Generate JSON report
npx playwright test --reporter=json > test-results.json

# Multiple reporters
npx playwright test --reporter=html,junit,json
```

## Environment Management

### Multi-Environment Support

The framework supports multiple environments through environment-specific configuration files:

1. **Development** (`.env.dev`) - [X] Available
2. **CI/CD** (`.env.ci`) - [X] Available
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

## Continuous Integration (CI/CD)

### GitHub Actions Setup

The project includes two GitHub Actions workflows for automated testing:

#### 1. Pull Request Tests (`playwright-tests.yml`)

- **Trigger**: Automatically on PR to main/master branches
- **Schedule**: Every 4 hours for continuous validation
- **Manual**: Via GitHub Actions UI (workflow_dispatch)
- **Features**:
  - 4-way parallel sharding for faster execution
  - Automatic PR comments with results
  - Artifact retention for 30 days
  - Resource monitoring and optimization

#### 2. End-to-End Tests (`e2e-tests.yml`)

- **Trigger**: Push to main branch or manual
- **Features**: Full regression suite execution

### CI/CD Configuration

```yaml
# GitHub Actions Configuration
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]  # 4 parallel jobs
        shardTotal: [4]
    
    env:
      CI: true
      ENV: ci
      NODE_OPTIONS: '--max-old-space-size=4096'  # 4GB memory limit
      HEADLESS: true
```

### Running Tests in CI

```bash
# CI-optimized execution (used in GitHub Actions)
npm run test:ci

# CI with sharding (for parallel pipeline stages)
npm run test:ci-sharded -- --shard=1/4
npm run test:ci-sharded -- --shard=2/4
npm run test:ci-sharded -- --shard=3/4
npm run test:ci-sharded -- --shard=4/4
```

### CI Artifacts

- **Test Reports**: HTML reports with screenshots
- **Traces**: Debug traces for failed tests
- **Videos**: Screen recordings (if enabled)
- **Logs**: Consolidated test execution logs

### Setting Up Your Own CI/CD

1. **Fork/Clone the Repository**
2. **Enable GitHub Actions** in your repository settings
3. **Configure Secrets** (if using private credentials):
   ```
   Settings → Secrets → Actions → New repository secret
   ```
4. **Customize Workflows** in `.github/workflows/` as needed
5. **Monitor Runs** in the Actions tab

## Cross-Platform & Browser Support

### Platform Coverage Matrix

| Platform | Browser | Viewport | Device | Status |
|----------|---------|----------|--------|--------|
| **Desktop Windows** | Chrome, Edge | 1920x1080 | - | [SUPPORTED] |
| **Desktop macOS** | Chrome, Firefox, Safari | 1920x1080 | - | [SUPPORTED] |
| **Desktop Linux** | Chrome, Firefox | 1920x1080 | - | [SUPPORTED] |
| **Mobile Android** | Chrome | 393x851 | Pixel 5 | [EMULATED] |
| **Mobile iOS** | Safari | 390x844 | iPhone 12 | [EMULATED] |
| **Tablet** | Safari | 1024x1366 | iPad Pro | [EMULATED] |

### Running Platform-Specific Tests

#### Desktop Testing
```bash
# All desktop browsers
npm run test:cross-browser

# Individual desktop browsers
npm run test:chrome     # Windows/Mac/Linux
npm run test:firefox    # Windows/Mac/Linux
npm run test:safari     # macOS only
npm run test:edge       # Windows primarily
```

#### Mobile Testing
```bash
# All mobile platforms
npm run test:mobile

# Includes:
# - Chrome Mobile (Android - Pixel 5)
# - Safari Mobile (iOS - iPhone 12)
```

#### Tablet Testing
```bash
# iPad Pro testing
npm run test:tablet
```

#### Cross-Platform Testing
```bash
# Run tests across ALL platforms and browsers
npm run test:all-platforms
```

### Platform-Specific Considerations

#### Windows
- Requires Windows 10 version 1809 or higher
- Edge browser is native, others require installation
- Use PowerShell or WSL for script execution

#### macOS
- Safari tests require macOS 11+ (Big Sur or later)
- Enable Safari Developer menu for WebDriver
- Grant screen recording permissions for video capture

#### Linux
- Install browser dependencies: `npx playwright install-deps`
- May require additional fonts for proper rendering
- Headless mode recommended for CI environments

#### Docker Support
```dockerfile
# Example Dockerfile for containerized testing
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install

CMD ["npm", "run", "test:ci"]
```

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

## Troubleshooting Guide

### Common Issues & Solutions

#### 1. Browser Installation Issues

```bash
# Full installation with system dependencies
npx playwright install --with-deps

# Specific browser installation
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Check installed browsers
npx playwright --version
```

#### 2. Memory Issues (CI/Local)

```bash
# Increase Node.js memory limit
export NODE_OPTIONS='--max-old-space-size=4096'
npm test

# Reduce parallel workers
npm test -- --workers=1

# Run tests sequentially
npm test -- --workers=1 --fully-parallel=false
```

#### 3. Platform-Specific Issues

**macOS Safari Issues:**
```bash
# Enable Safari WebDriver
safaridriver --enable

# Grant permissions
# System Preferences → Security & Privacy → Privacy → Screen Recording
```

**Linux Headless Issues:**
```bash
# Install required dependencies
sudo apt-get update
sudo apt-get install -y libgbm-dev xvfb

# Run with xvfb
xvfb-run npm test
```

**Windows Path Issues:**
```powershell
# Use forward slashes or escaped backslashes
$env:BASE_URL="https://opensource-demo.orangehrmlive.com"
npm test
```

#### 4. Test Failures Debugging

```bash
# Enable debug mode with UI
npm run debug

# Enable verbose logging
LOG_LEVEL=debug npm test

# Generate trace for specific test
npx playwright test --trace on tests/orangehrm-login.spec.ts

# View trace
npx playwright show-trace trace.zip
```

#### 5. Network & Timeout Issues

```bash
# Increase timeouts
npx playwright test --timeout=60000

# Retry failed tests
npx playwright test --retries=2

# Skip proxy for local testing
export NO_PROXY=localhost,127.0.0.1
npm test
```

#### 6. Environment Configuration Issues

```bash
# Verify environment variables
node -e "console.log(process.env)"

# Test with explicit environment
ENV=dev npm test

# Check .env file loading
node -e "require('dotenv').config({ path: '.env.dev' }); console.log(process.env.BASE_URL)"
```

### Advanced Debugging

#### Interactive Debugging
```bash
# Playwright Inspector UI
npm run debug

# VS Code debugging
# Add breakpoints and use F5 with launch.json configuration
```

#### Trace Viewer
```bash
# Record traces for all tests
npx playwright test --trace on

# View specific trace
npx playwright show-trace test-results/*/trace.zip
```

#### Console Logs
```bash
# Check application logs
tail -f logs/combined.log

# Check error logs only
tail -f logs/error.log
```

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

## Performance & Best Practices

### Test Execution Performance

| Configuration | Workers | Execution Time | Use Case |
|--------------|---------|----------------|----------|
| Sequential | 1 | ~3-4 min | Debugging, Low-resource environments |
| Parallel (Default) | 4 | ~1-2 min | Local development |
| Maximum Parallel | 5 | ~45-60 sec | High-performance machines |
| CI Sharded | 4 shards | ~1 min/shard | GitHub Actions parallel jobs |

### Best Practices

1. **Test Organization**
   - Group related tests in describe blocks
   - Use meaningful test names with test IDs
   - Implement proper test isolation

2. **Page Object Model**
   - Keep selectors in page objects
   - Use data-testid attributes when possible
   - Implement reusable methods

3. **Environment Management**
   - Never commit sensitive credentials
   - Use environment-specific configs
   - Validate environment variables on startup

4. **CI/CD Optimization**
   - Use test sharding for parallel execution
   - Implement smart retries for flaky tests
   - Cache dependencies and browsers

5. **Debugging**
   - Use trace viewer for complex issues
   - Enable screenshots on failure
   - Implement comprehensive logging

## Test Execution Statistics

### Single Platform vs Full Coverage

| Execution Type | Test Cases | Platforms | Total Executions | Time |
|----------------|------------|-----------|------------------|------|
| Single Browser | 15 | 1 | 15 | ~1-2 min |
| Cross-Browser Desktop | 15 | 4 | 60 | ~3-4 min |
| Mobile Only | 15 | 2 | 30 | ~2-3 min |
| Full Coverage | 15 | 7 | **105** | ~5-7 min |

### Test Distribution Across Platforms

```
Total Executions = Test Cases × Platforms
                 = 15 × 7
                 = 105 test executions
```

**Breakdown:**
- Chrome Desktop: 15 executions
- Firefox Desktop: 15 executions  
- Safari Desktop: 15 executions
- Edge Desktop: 15 executions
- Chrome Mobile (Pixel 5): 15 executions
- Safari Mobile (iPhone 12): 15 executions
- iPad Pro: 15 executions

```
[REFERENCE] Complete test traceability matrix: TEST_TRACEABILITY_MATRIX.md
```

## Version History

- **v1.0.0**: Initial release
  - 15 unique automated test cases (5 login + 10 search)
  - 105 total test executions across all platforms
  - Cross-browser support (Chrome, Firefox, Safari, Edge)
  - Multi-platform testing (Desktop, Mobile, Tablet)
  - CI/CD integration with GitHub Actions (4-way sharding)
  - Comprehensive logging and reporting
  - Environment-based configuration
