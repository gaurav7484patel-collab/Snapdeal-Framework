import { Page , Locator, expect } from "@playwright/test";
import * as CommonMethods from '../utilities/CommonMethods.ts'
import { allureId } from "allure-js-commons";
import { reportStep } from "../utilities/allure-util.ts";
import logger from "../utilities/logutils.ts";


export class AddToCart{
    readonly page : Page
    readonly addtocart : Locator

    constructor (page : Page){
        this.page = page
        this.addtocart = page.locator("#add-cart-button-id")
    }
    async clickonaddtocartbutton(){
        logger.info('click on add to cart button')
        await reportStep('Click On Add To cart Button',async ()=>{
        await expect(this.addtocart).toBeVisible({timeout:15000})
        await this.addtocart.click()
        })
    }
}