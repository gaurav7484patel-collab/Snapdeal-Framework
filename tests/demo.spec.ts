import {test} from '../fixtures/BaseFixtures.ts'

test('demo failure test', async ({page}) => {
    await page.goto('https://google.com');
    await page.locator('textarea[@role="combobb"]').fill('Playwright');
});
test('demo2', async ({page}) => {
    await page.goto('https://google.com');
    await page.locator('textarea[@role="combobb"]').fill('Playwright');
});
