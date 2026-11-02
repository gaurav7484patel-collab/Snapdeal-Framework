import { SearchPage } from '../pages/SearchPage'
import data from '../test-data/SearchData.json'
import {test} from '../fixtures/myfixtures.ts'

for (let d of data){
    test(`Search data with valid product : ${d.scenario}`, async ({page , homepage , searchpage})=>{
        await homepage.HomepageOpen()
        await searchpage.EnterKeywordInSearchBox(d.searchdata)
        await searchpage.keyboardPressEnter()
        await searchpage.ClickOnFirstProduct()
    })
}