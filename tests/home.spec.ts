import { HomePage } from "../pages/HomePage"
import {test} from '../fixtures/myfixtures.ts'

test('snap deal homepage open', async ({homepage})=>{
    await homepage.HomepageOpen()
})