import { Page, expect, Locator } from '@playwright/test';
import logger from '../../lib/logger';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly requiredFieldErrors: Locator;
    readonly dashboardHeading: Locator;
    readonly userDropdown: Locator;
    readonly sidePanel: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.usernameField = page.locator('input[name="username"]');
        this.passwordField = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.oxd-alert-content--error');
        this.requiredFieldErrors = page.locator('.oxd-input-field-error-message');
        this.dashboardHeading = page.locator('h6:has-text("Dashboard")');
        this.userDropdown = page.locator('.oxd-userdropdown');
        this.sidePanel = page.locator('.oxd-sidepanel');
    }

    async navigateToLoginPage(baseUrl: string): Promise<void> {
        await this.logEnvironmentInfo();
        const platform = await this.getPlatformInfo();
        logger.info(`Navigating to OrangeHRM login page on ${platform.isMobile ? 'mobile' : platform.isTablet ? 'tablet' : 'desktop'}`);
        
        const adjustedTimeout = this.getAdjustedTimeout(30000);
        await this.page.goto(baseUrl, {
            waitUntil: 'domcontentloaded',
            timeout: adjustedTimeout
        });
        
        // Wait for login form to be visible with platform-specific timeout
        const fieldTimeout = platform.isMobile ? this.getAdjustedTimeout(15000) : this.getAdjustedTimeout(10000);
        await this.page.waitForSelector('input[name="username"]', { state: 'visible', timeout: fieldTimeout });
        
        // On mobile, ensure form is properly positioned
        if (platform.isMobile) {
            await this.page.evaluate(() => window.scrollTo(0, 0));
            await this.page.waitForTimeout(300);
        }
        
        logger.info('Login page loaded successfully');
    }

    async verifyPageLoad(): Promise<void> {
        await expect(this.usernameField).toBeVisible({ timeout: 10000 });
        logger.info('Login page loaded with username field visible');
    }

    async enterUsername(username: string): Promise<void> {
        await this.crossBrowserFill('input[name="username"]', username);
        logger.info(`Entered username: ${username}`);
    }

    async enterPassword(password: string): Promise<void> {
        await this.crossBrowserFill('input[name="password"]', password);
        // Verify password field masks input characters (type='password')
        await expect(this.passwordField).toHaveAttribute('type', 'password');
        logger.info('Entered password and verified masking');
    }

    async clickLoginButton(): Promise<void> {
        await expect(this.loginButton).toBeEnabled();
        await this.crossBrowserClick('button[type="submit"]');
        logger.info('Clicked login button');
    }

    async clearFields(): Promise<void> {
        await this.usernameField.clear();
        await this.passwordField.clear();
        logger.info('Cleared username and password fields');
    }

    async waitForDashboard(): Promise<void> {
        // Wait for dashboard URL with timeout
        await this.page.waitForURL('**/dashboard/index', { timeout: 10000 });
        logger.info('Successfully navigated to dashboard');
    }

    async verifyDashboardElements(): Promise<void> {
        const platform = await this.getPlatformInfo();
        
        // Dashboard heading visible
        await expect(this.dashboardHeading).toBeVisible({ timeout: 5000 });
        
        // User dropdown visible
        await expect(this.userDropdown).toBeVisible({ timeout: 5000 });
        
        // Sidebar menu verification - different behavior on mobile
        if (platform.isMobile) {
            // On mobile, sidebar might be collapsed but still exist in DOM
            const sidebarExists = await this.sidePanel.count();
            expect(sidebarExists).toBeGreaterThan(0);
            logger.info('Mobile dashboard elements verified successfully - sidebar exists in DOM');
        } else {
            // On desktop, sidebar should be visible
            await expect(this.sidePanel).toBeVisible({ timeout: 5000 });
            logger.info('Desktop dashboard elements verified successfully');
        }
    }

    async verifyErrorMessage(expectedText: string): Promise<void> {
        // Wait for error message to appear within timeout
        await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
        
        // Verify error message contains expected text
        await expect(this.errorMessage).toContainText(expectedText);
        
        logger.info('Error message displayed for invalid credentials');
    }

    async verifyFormStateAfterError(): Promise<void> {
        // User remains on login page (URL contains '/auth/login')
        await expect(this.page).toHaveURL(/.*auth\/login/);
        
        // Form fields remain enabled for retry
        await expect(this.usernameField).toBeVisible();
        await expect(this.usernameField).toBeEnabled();
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        
        logger.info('Form is ready for immediate retry');
    }

    async verifyClientSideValidation(): Promise<void> {
        // Each empty field shows 'Required' validation message
        await expect(this.requiredFieldErrors).toHaveCount(2);
        
        // Verify the messages say "Required"
        const messages = await this.requiredFieldErrors.allTextContents();
        for (const message of messages) {
            expect(message).toBe('Required');
        }
        
        logger.info('Client-side validation triggered with Required messages');
    }

    async verifyFieldLevelErrors(): Promise<void> {
        // User stays on login page
        await expect(this.page).toHaveURL(/.*auth\/login/);
        
        // Fields highlighted with error state (validation messages have error styling)
        await expect(this.requiredFieldErrors.first()).toBeVisible();
        
        logger.info('Field-level error messages displayed, user remains on login page');
    }

    async verifyPasswordFieldSecurity(): Promise<void> {
        // Verify password field has type='password' attribute
        await expect(this.passwordField).toHaveAttribute('type', 'password');
        logger.info('Password field properly masked with type=password attribute');
    }

    async typePasswordSlowly(password: string): Promise<void> {
        // Type password slowly to verify masking
        await this.passwordField.fill(password);
        // Verify password field has type='password' attribute
        await expect(this.passwordField).toHaveAttribute('type', 'password');
        logger.info('Password typed slowly for security verification');
    }

    async refreshPageAndVerifyFieldCleared(): Promise<void> {
        // Refresh page and verify field is cleared
        await this.page.reload();
        await this.page.waitForSelector('input[name="password"]', { state: 'visible' });
        
        const refreshedPasswordField = this.page.locator('input[name="password"]');
        await expect(refreshedPasswordField).toHaveValue('');
        
        logger.info('Password field cleared on page refresh as expected');
    }

    async takeScreenshot(filename: string): Promise<void> {
        await this.takeCrossBrowserScreenshot(filename);
    }

    // Convenience methods for common login flows
    async loginWithCredentials(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    async performValidLogin(username: string, password: string): Promise<void> {
        await this.loginWithCredentials(username, password);
        await this.waitForDashboard();
        await this.verifyDashboardElements();
    }

    async performInvalidLogin(username: string, password: string): Promise<void> {
        await this.loginWithCredentials(username, password);
        await this.verifyErrorMessage('Invalid credentials');
        await this.verifyFormStateAfterError();
    }

    async performEmptyFieldsTest(): Promise<void> {
        await this.clearFields();
        await this.clickLoginButton();
        await this.verifyClientSideValidation();
        await this.verifyFieldLevelErrors();
    }
}