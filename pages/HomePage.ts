import { Page, Locator , Expect, expect } from "@playwright/test";

export class HomePage{
    readonly page : Page
    readonly searchbox : Locator
    constructor (page:Page){
        this.page = page
        this.searchbox = page.locator('#search-box-input')
    }

    async HomepageOpen(){
        await this.page.goto("https://www.snapdeal.com/")
        await expect(this.page).toBeTruthy()
    }
}