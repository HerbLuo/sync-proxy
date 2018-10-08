import { syncObjectProxyL1 } from "../src/SyncProxy";

class Api {
    private readonly args: any[] = [];
    public promisedApi = Promise.resolve(this);

    async promiseApiReturningFunc(...args: any[]): Promise<this> {
        this.args.push(args);
        return this
    }

    success = "success";
    successPromise = Promise.resolve(this.success);
    successReturningFunc(arg1: any, arg2: any): string {
        this.args.push([arg1, arg2]);
        return this.success
    }
    async successPromiseReturningFunc(arg1: any, arg2: any): Promise<string> {
        this.args.push([arg1, arg2]);
        return this.success
    }

    getArgs() {
        return this.args
    }
}

export const api = new Api();

export const apiSync = syncObjectProxyL1(api);
export const SUCCESS_STR = "success";
