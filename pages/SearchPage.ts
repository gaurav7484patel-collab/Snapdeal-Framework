import { Page, Locator } from "@playwright/test";
import * as CommonMethods from '../utilities/CommonMethods.ts'
import SearchData from '../test-data/SearchData.json'
import { AddToCart } from "./AddToCart.ts";
import { reportStep } from "../utilities/allure-util.ts";
import logger from "../utilities/logutils.ts";

export class SearchPage {
    readonly page: Page
    readonly searchBox: Locator
    readonly autoSuggestion: Locator
    readonly firstproductclick: Locator

    constructor(page: Page) {
        this.page = page
        this.searchBox = page.locator('#search-box-input')
        this.autoSuggestion = page.locator("//div[contains(@class,'HeaderStyle__SuggestionContainer')]//div//span")
        this.firstproductclick = page.locator("//div[contains(@class,'favDp product-tuple-listing js-tuple ')]")
    }

    async EnterKeywordInSearchBox(Keyword: any) {
        logger.info('Enter keyword')
        await reportStep('Enter text in searchbox', async () => {
            await CommonMethods.enterText(this.page, this.searchBox, Keyword)
        })
    }
    async keyboardPressEnter() {
        logger.info('enter key press')
        await reportStep('press enter key', async () => {
            await CommonMethods.keyboardPressEnter(this.page, this.searchBox)
        })
    }
    async ClickOnFirstProduct() {
        logger.info('click on first product and manage new tab')
        const [ProductTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.firstproductclick.first().click()
        ])
        await ProductTab.waitForLoadState('domcontentloaded')
        return new AddToCart(ProductTab)
    }
}