import { Page, Locator } from "@playwright/test";

export async function enterText(page:Page , locator :Locator , text : string) {
    await locator.fill(text)    
}
export async function clk(page:Page, locator : Locator) {
    await locator.click()    
}
export async function keyboardPressEnter(page : Page, locator : Locator) {
    await locator.press('Enter')    
}