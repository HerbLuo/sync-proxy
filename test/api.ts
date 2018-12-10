import { syncProxy } from "../src/SyncProxy";

class Api {
  public api = this;
  public promisedApi = Promise.resolve(this);
  public success = "success";
  public successPromise = Promise.resolve(this.success);

  private readonly args: any[] = [];

  public async promiseApiReturningFunc(...args: any[]): Promise<this> {
    this.args.push(args);
    return this
  }

  public successReturningFunc(arg1: any, arg2: any): string {
    this.args.push([arg1, arg2]);
    return this.success
  }

  public async successPromiseReturningFunc(arg1: any, arg2: any): Promise<string> {
    this.args.push([arg1, arg2]);
    return this.success
  }

  public getArgs() {
    return this.args
  }

  // noinspection JSMethodCanBeStatic
  public getResultProxy(): Result {
    return new Proxy(result, {
      get(target, key, receiver) {
        return Reflect.get(target, key, receiver)
      }
    })
  }
}

// tslint:disable-next-line:max-classes-per-file
class Result {
  private property = 'success';

  public successReturningFunc() {
    return this.property
  }

  public successPromiseReturningFunc() {
    return Promise.resolve(this.property)
  }
}

const result = new Result();

export const api = new Api();

export const apiSync = syncProxy(api);
export const SUCCESS_STR = "success";
