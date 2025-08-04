import { Page, expect, Locator } from '@playwright/test';
import logger from '../../lib/logger';
import { BasePage } from './basePage';

export class DashboardPage extends BasePage {
    readonly page: Page;
    readonly userDropdownTab: Locator;
    readonly userDropdown: Locator;
    readonly logoutOption: Locator;
    readonly adminMenuItem: Locator;
    readonly pimMenuItem: Locator;
    readonly dashboardMenuItem: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.userDropdownTab = page.locator('.oxd-userdropdown-tab');
        this.userDropdown = page.locator('.oxd-userdropdown');
        this.logoutOption = page.locator('a:has-text("Logout")');
        this.adminMenuItem = page.locator('.oxd-main-menu-item:has-text("Admin")');
        this.pimMenuItem = page.locator('.oxd-main-menu-item:has-text("PIM")');
        this.dashboardMenuItem = page.locator('.oxd-main-menu-item:has-text("Dashboard")');
    }

    async navigateToModule(moduleName: string): Promise<void> {
        const platform = await this.getPlatformInfo();
        const moduleItem = this.page.locator(`.oxd-main-menu-item:has-text("${moduleName}")`);
        
        if (platform.isMobile) {
            // On mobile, use JavaScript navigation to avoid overlapping elements
            try {
                await moduleItem.click();
            } catch (error) {
                logger.warn(`Mobile click failed for ${moduleName}, using JavaScript approach`);
                await this.page.evaluate((name) => {
                    const link = document.querySelector(`a[href*="${name.toLowerCase()}"]`);
                    if (link) link.click();
                }, moduleName);
            }
        } else {
            await moduleItem.click();
        }
        
        await expect(this.page).toHaveURL(new RegExp(`.*${moduleName.toLowerCase()}.*`));
        logger.info(`Navigated to ${moduleName} module on ${platform.isMobile ? 'mobile' : 'desktop'}`);
    }

    async openUserDropdown(): Promise<void> {
        await this.userDropdownTab.click();
        await expect(this.userDropdown).toBeVisible();
        logger.info('User dropdown opened and displays user information');
    }

    async clickLogout(): Promise<void> {
        await expect(this.logoutOption).toBeVisible();
        await this.logoutOption.click();
        logger.info('Logout option clicked');
    }

    async verifyCompleteLogout(): Promise<void> {
        // Logout redirects to login page successfully
        await this.page.waitForURL('**/auth/login', { timeout: 10000 });
        
        // Session completely terminated
        await expect(this.page.locator('input[name="username"]')).toBeVisible();
        await expect(this.page.locator('input[name="password"]')).toBeVisible();
        await expect(this.page.locator('button[type="submit"]')).toBeVisible();
        
        logger.info('Session completely terminated and redirected to login page');
    }

    async testBrowserBackButton(): Promise<void> {
        // Attempt to go back and verify no access to protected content
        await this.page.goBack();
        
        // Should still be on login page or redirect to login
        await expect(this.page.locator('input[name="username"]')).toBeVisible({ timeout: 5000 });
        
        logger.info('Browser back button does not access protected content after logout');
    }

    async performFullLogoutFlow(): Promise<void> {
        await this.openUserDropdown();
        await this.clickLogout();
        await this.verifyCompleteLogout();
        await this.testBrowserBackButton();
    }

    async navigateThroughMultipleModules(): Promise<void> {
        // Navigate to Admin module
        await this.navigateToModule('Admin');
        
        // Navigate to PIM module
        await this.navigateToModule('PIM');
        
        // Navigate back to Dashboard
        await this.navigateToModule('Dashboard');
        
        logger.info('Session persists across module navigation');
    }
}