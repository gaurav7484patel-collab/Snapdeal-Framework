import {test as base , expect} from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { SearchPage } from '../pages/SearchPage'
import { AddToCart } from '../pages/AddToCart'
import { LoginPage } from '../pages/LoginPage'

type customfixtures = {
    homepage : HomePage
    searchpage : SearchPage
    addtocart : AddToCart
    loginpage : LoginPage
}

export const test = base.extend <customfixtures>({
    homepage : async ({page}, use)=>{
        const homepage = new HomePage(page)
        await use(homepage)
    },
    searchpage : async ({page}, use)=>{
        const searchpage = new SearchPage(page)
        await use(searchpage)
    },
    addtocart : async ({page}, use)=>{
        const addtocart = new AddToCart(page)
        await use(addtocart)
    },
    loginpage : async ({page}, use)=>{
        const loginpage = new LoginPage(page)
        await use(loginpage)
    }
})