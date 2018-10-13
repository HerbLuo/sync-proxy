import { syncProxy } from "../src/SyncProxy";

class Api {
    private readonly args: any[] = [];
    public api = this;
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

    // noinspection JSMethodCanBeStatic
    getResultProxy(): Result {
        return new Proxy(result, {
            get(target, key, receiver) {
                return Reflect.get(target, key, receiver)
            }
        })
    }

}

class Result {
    private property = 'success';

    successReturningFunc() {
        return this.property
    }

    successPromiseReturningFunc() {
        return Promise.resolve(this.property)
    }
}

const result = new Result();

export const api = new Api();

export const apiSync = syncProxy(api);
export const SUCCESS_STR = "success";
