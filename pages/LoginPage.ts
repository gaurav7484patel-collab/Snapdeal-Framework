import { expect, Locator, Page } from '@playwright/test'

export class LoginPage {
    readonly page: Page
    readonly emailField: Locator
    readonly passwordField: Locator
    readonly signInButton: Locator
    readonly forgotPasswordLink: Locator
    readonly resetPasswordHeading: Locator
    readonly recoveryEmailField: Locator
    readonly cancelRecoveryLink: Locator

    constructor(page: Page) {
        this.page = page
        this.emailField = page.getByLabel('Email Address')
        this.passwordField = page.getByLabel('Password')
        this.signInButton = page.getByRole('button', { name: 'Sign In' })
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' })
        this.resetPasswordHeading = page.getByRole('heading', { name: 'Reset Password' })
        this.recoveryEmailField = page.locator('#recover-email')
        this.cancelRecoveryLink = page.getByRole('link', { name: 'Cancel' })
    }

    async openLoginPage() {
        await this.page.goto('https://sauce-demo.myshopify.com/account/login')
    }

    async verifyLoginPage() {
        await expect(this.page).toHaveTitle('Account – Sauce Demo')
        await expect(this.page.getByRole('heading', { name: 'Customer Login' })).toBeVisible()
        await expect(this.emailField).toBeVisible()
        await expect(this.passwordField).toBeVisible()
        await expect(this.signInButton).toBeVisible()
    }

    async enterCredentials(email: string, password: string) {
        await this.emailField.fill(email)
        await this.passwordField.fill(password)
    }

    async clickSignIn() {
        await this.signInButton.click()
    }

    async openPasswordRecovery() {
        await this.forgotPasswordLink.click()
    }

    async cancelPasswordRecovery() {
        await this.cancelRecoveryLink.click()
    }
}
