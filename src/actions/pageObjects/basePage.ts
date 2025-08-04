import { Page, Browser, BrowserContext } from '@playwright/test';
import logger from '../../lib/logger';

export class BasePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly browser: Browser;

    constructor(page: Page) {
        this.page = page;
        this.context = page.context();
        this.browser = this.context.browser()!;
    }

    // Get browser information
    getBrowserName(): string {
        return this.browser.browserType().name();
    }

    // Get platform information
    async getPlatformInfo(): Promise<{ isMobile: boolean; isTablet: boolean; isDesktop: boolean; userAgent: string }> {
        const userAgent = await this.page.evaluate(() => navigator.userAgent);
        const viewport = this.page.viewportSize();
        
        const isMobile = viewport ? viewport.width < 768 : false;
        const isTablet = viewport ? viewport.width >= 768 && viewport.width < 1024 : false;
        const isDesktop = viewport ? viewport.width >= 1024 : true;

        return {
            isMobile,
            isTablet, 
            isDesktop,
            userAgent
        };
    }

    // Cross-browser compatible click
    async crossBrowserClick(selector: string, options: { timeout?: number } = {}): Promise<void> {
        const browserName = this.getBrowserName();
        const element = this.page.locator(selector);
        
        try {
            // Standard click
            await element.click({ timeout: options.timeout || 10000 });
        } catch (error) {
            logger.warn(`Standard click failed on ${browserName}, trying alternative approach`);
            
            // Fallback for browser-specific issues
            if (browserName === 'webkit') {
                // Safari specific handling
                await element.focus();
                await this.page.keyboard.press('Enter');
            } else {
                // Force click for other browsers
                await element.click({ force: true, timeout: options.timeout || 10000 });
            }
        }
    }

    // Cross-browser compatible text input
    async crossBrowserFill(selector: string, value: string, options: { timeout?: number } = {}): Promise<void> {
        const browserName = this.getBrowserName();
        const element = this.page.locator(selector);
        
        try {
            await element.fill(value, { timeout: options.timeout || 10000 });
        } catch (error) {
            logger.warn(`Standard fill failed on ${browserName}, trying alternative approach`);
            
            // Clear field first, then type
            await element.clear();
            await element.type(value, { delay: 50 });
        }
    }

    // Cross-platform compatible wait
    async crossPlatformWait(condition: () => Promise<boolean>, timeout: number = 10000): Promise<void> {
        const platform = await this.getPlatformInfo();
        const adjustedTimeout = platform.isMobile ? timeout * 1.5 : timeout; // Increase timeout for mobile
        
        await this.page.waitForFunction(condition, { timeout: adjustedTimeout });
    }

    // Handle responsive design differences
    async handleResponsiveElement(mobileSelector: string, desktopSelector: string): Promise<string> {
        const platform = await this.getPlatformInfo();
        
        if (platform.isMobile) {
            const mobileElement = this.page.locator(mobileSelector);
            if (await mobileElement.isVisible().catch(() => false)) {
                return mobileSelector;
            }
        }
        
        return desktopSelector;
    }

    // Browser-specific screenshot with naming
    async takeCrossBrowserScreenshot(baseName: string): Promise<void> {
        const browserName = this.getBrowserName();
        const platform = await this.getPlatformInfo();
        const deviceType = platform.isMobile ? 'mobile' : platform.isTablet ? 'tablet' : 'desktop';
        
        const fileName = `${baseName}-${browserName}-${deviceType}-${Date.now()}.png`;
        
        await this.page.screenshot({ 
            path: `ui/screenshots/${fileName}`,
            fullPage: true 
        });
        
        logger.info(`Screenshot taken: ${fileName}`);
    }

    // Handle browser-specific timeouts
    getAdjustedTimeout(baseTimeout: number): number {
        const browserName = this.getBrowserName();
        
        // Adjust timeouts based on browser performance characteristics
        switch (browserName) {
            case 'webkit':
                return baseTimeout * 1.2; // Safari can be slower
            case 'firefox':
                return baseTimeout * 1.1; // Firefox slightly slower
            case 'chromium':
            default:
                return baseTimeout;
        }
    }

    // Cross-browser compatible scroll
    async crossBrowserScrollToElement(selector: string): Promise<void> {
        const element = this.page.locator(selector);
        const browserName = this.getBrowserName();
        
        if (browserName === 'webkit') {
            // Safari specific scrolling
            await element.scrollIntoViewIfNeeded();
        } else {
            await element.scrollIntoViewIfNeeded();
        }
        
        // Additional wait for scroll completion
        await this.page.waitForTimeout(500);
    }

    // Mobile-specific navigation helper to handle overlapping elements
    async mobileJavaScriptNavigation(url: string): Promise<void> {
        const platform = await this.getPlatformInfo();
        
        if (platform.isMobile) {
            logger.info(`Using JavaScript navigation to ${url} on mobile`);
            await this.page.evaluate((targetUrl) => {
                window.location.href = targetUrl;
            }, url);
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    // Log browser and platform information
    async logEnvironmentInfo(): Promise<void> {
        const browserName = this.getBrowserName();
        const platform = await this.getPlatformInfo();
        const viewport = this.page.viewportSize();
        
        logger.info(`Test Environment: ${browserName} on ${platform.isDesktop ? 'Desktop' : platform.isTablet ? 'Tablet' : 'Mobile'}`);
        logger.info(`Viewport: ${viewport?.width}x${viewport?.height}`);
        logger.info(`User Agent: ${platform.userAgent}`);
    }
}