import { test } from '../fixtures/myfixtures.ts'
import { expect } from '@playwright/test'

test.describe('Sauce Demo login page', () => {
    test('positive: displays the expected fields and page title', async ({ loginpage }) => {
        // await loginpage.openLoginPage()
        await loginpage.verifyLoginPage()
    })

    test('positive: accepts a validly formatted email and password', async ({ loginpage }) => {
        await loginpage.openLoginPage()
        await loginpage.enterCredentials('shopper@example.com', 'ExamplePassword123')

        await expect(loginpage.emailField).toHaveValue('shopper@example.com')
        await expect(loginpage.passwordField).toHaveValue('ExamplePassword123')
        await expect(loginpage.passwordField).toHaveAttribute('type', 'password')
    })

    test('negative: prevents submission when the email format is invalid', async ({ loginpage }) => {
        await loginpage.openLoginPage()
        await loginpage.enterCredentials('not-an-email', 'ExamplePassword123')
        await loginpage.clickSignIn()

        await expect(loginpage.page).toHaveURL(/\/account\/login$/)
        const hasEmailTypeMismatch = await loginpage.emailField.evaluate(
            (input: HTMLInputElement) => input.validity.typeMismatch
        )
        expect(hasEmailTypeMismatch).toBe(true)
    })

    test('regression: password recovery can be opened and cancelled', async ({ loginpage }) => {
        await loginpage.openLoginPage()
        await loginpage.openPasswordRecovery()

        await expect(loginpage.resetPasswordHeading).toBeVisible()
        await expect(loginpage.recoveryEmailField).toBeVisible()
        await expect(loginpage.page.getByText('We will send you an email to reset your password.')).toBeVisible()

        await loginpage.cancelPasswordRecovery()
        await expect(loginpage.page.getByRole('heading', { name: 'Customer Login' })).toBeVisible()
        await expect(loginpage.emailField).toBeVisible()
        await expect(loginpage.passwordField).toBeVisible()
    })
})
