import { APIRequestContext } from "@playwright/test";
export class ApiUtility{
    static getRequest(arg0: string) {
        throw new Error('Method not implemented.');
    }
    constructor(private request:APIRequestContext){

    }

    async getRequest(url:string):Promise<any>{
        return await this.request.get(url)
    }
    async postRequest(url:string):Promise<any>{
        return await this.request.get(url)
    }

}