import { step as allureStep } from 'allure-js-commons';

export async function reportStep(name: string,action: () => Promise<void>): Promise<void> 
{
    await allureStep(name, action);
}