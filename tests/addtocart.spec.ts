import { test } from '../fixtures/myfixtures.ts'
import data from '../test-data/SearchData.json'
for (let d of data) {
    test(`click on add to cart button :${d.scenario}`, async ({ page, homepage, searchpage }) => {
        await homepage.HomepageOpen()
        await searchpage.EnterKeywordInSearchBox(d.searchdata)
        await searchpage.keyboardPressEnter()
        const productpage = await searchpage.ClickOnFirstProduct()
        await productpage.clickonaddtocartbutton()
})
}