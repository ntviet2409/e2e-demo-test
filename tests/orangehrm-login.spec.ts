import { test } from '@playwright/test';
import logger from '@/lib/logger';
import { LoginPage } from '../src/actions/pageObjects/loginPage';
import { DashboardPage } from '../src/actions/pageObjects/dashboardPage';

test.describe.configure({ mode: 'serial' });

test.describe('OrangeHRM Login Tests (POM)', { tag: '@OrangeHRM' }, () => {
    const BASE_URL = process.env.ORANGEHRM_BASE_URL || 'https://opensource-demo.orangehrmlive.com';
    const VALID_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
    const VALID_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';
    const INVALID_USERNAME = 'InvalidUser';
    const INVALID_PASSWORD = 'wrongpass123';

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage(BASE_URL);
    });

    test('TC_LOGIN_001: Login - Valid Credentials Authentication Flow', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('Navigate to OrangeHRM login page URL and wait for page load completion', async () => {
            await loginPage.verifyPageLoad();
        });

        await test.step('Enter \'Admin\' in username field (selector: \'input[name="username"]\') ', async () => {
            await loginPage.enterUsername(VALID_USERNAME);
        });

        await test.step('Enter \'admin123\' in password field (selector: \'input[name="password"]\') ', async () => {
            await loginPage.enterPassword(VALID_PASSWORD);
        });

        await test.step('Click Login button (selector: \'button[type="submit"]\') ', async () => {
            await loginPage.clickLoginButton();
        });

        await test.step('Wait for navigation (URL should contain \'/dashboard/index\') ', async () => {
            await loginPage.waitForDashboard();
        });

        await test.step('Verify dashboard elements are loaded', async () => {
            await loginPage.verifyDashboardElements();
            await loginPage.takeScreenshot('TC_LOGIN_001-success');
        });
    });

    test('TC_LOGIN_002: Login - Invalid Credentials Error Handling', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('Navigate to OrangeHRM login page and verify page load', async () => {
            await loginPage.verifyPageLoad();
        });

        await test.step('Enter \'InvalidUser\' in username field (selector: \'input[name="username"]\') ', async () => {
            await loginPage.enterUsername(INVALID_USERNAME);
        });

        await test.step('Enter \'wrongpassword123\' in password field (selector: \'input[name="password"]\') ', async () => {
            await loginPage.enterPassword(INVALID_PASSWORD);
        });

        await test.step('Click Login button (selector: \'button[type="submit"]\') ', async () => {
            await loginPage.clickLoginButton();
        });

        await test.step('Wait for error message (selector: \'.oxd-alert-content--error\') ', async () => {
            await loginPage.verifyErrorMessage('Invalid credentials');
        });

        await test.step('Verify form state after error', async () => {
            await loginPage.verifyFormStateAfterError();
            await loginPage.takeScreenshot('TC_LOGIN_002-error');
        });
    });

    test('TC_LOGIN_005: Login - Empty Fields Client-Side Validation', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await loginPage.verifyPageLoad();
        });

        await test.step('Leave username field empty or clear it (selector: \'input[name="username"]\') ', async () => {
            // Fields are already empty, but explicitly clear them
            await loginPage.clearFields();
        });

        await test.step('Leave password field empty or clear it (selector: \'input[name="password"]\') ', async () => {
            // Already cleared in previous step
            logger.info('Password field cleared/left empty');
        });

        await test.step('Attempt form submission (selector: \'button[type="submit"]\') ', async () => {
            await loginPage.clickLoginButton();
        });

        await test.step('Verify client-side validation triggers', async () => {
            await loginPage.verifyClientSideValidation();
        });

        await test.step('Check for field-level error messages and verify user remains on login page', async () => {
            await loginPage.verifyFieldLevelErrors();
        });
    });

    test('TC_LOGIN_009: Login - Password Field Security Validation', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await loginPage.verifyPageLoad();
        });

        await test.step('Click password field (selector: \'input[name="password"]\') ', async () => {
            await loginPage.passwordField.click();
            logger.info('Password field clicked and focused');
        });

        await test.step('Type password \'admin123\' slowly and verify masking during input', async () => {
            await loginPage.typePasswordSlowly(VALID_PASSWORD);
            await loginPage.verifyPasswordFieldSecurity();
        });

        await test.step('Inspect element for type=\'password\' attribute and verify field cleared on page refresh', async () => {
            await loginPage.verifyPasswordFieldSecurity();
            await loginPage.refreshPageAndVerifyFieldCleared();
        });
    });

    test('TC_LOGIN_008: Login - Session Management and Logout Flow', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await test.step('Login with valid credentials (Admin/admin123)', async () => {
            await loginPage.performValidLogin(VALID_USERNAME, VALID_PASSWORD);
        });

        await test.step('Navigate through 3+ different modules', async () => {
            await dashboardPage.navigateThroughMultipleModules();
        });

        await test.step('Open user dropdown (selector: \'.oxd-userdropdown-tab\') ', async () => {
            await dashboardPage.openUserDropdown();
        });

        await test.step('Click Logout (selector: \'a:has-text("Logout")\') ', async () => {
            await dashboardPage.clickLogout();
        });

        await test.step('Verify complete logout', async () => {
            await dashboardPage.verifyCompleteLogout();
        });

        await test.step('Test browser back button', async () => {
            await dashboardPage.testBrowserBackButton();
        });
    });
});