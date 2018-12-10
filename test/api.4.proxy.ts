/* tslint:disable:no-console */
export class Api4Proxy {
  constructor(private readonly lApi: Api) {
  }

  public doA(arg: string) {
    return this.priDoA(arg)
  }

  public async priDoA(arg: string): Promise<INewApi> {
    const lApi = this.lApi;
    return new Proxy(lApi, {
      get(_: any, key, receiver) {
        if (key === 'then') {
          return undefined
        }
        return (...args: any[]) => {
          const func = Reflect.get(lApi, key, receiver);
          const value = func.call(lApi, arg, ...args);
          console.log(value.then(console.log));
          return value;
        }
      }
    })
  }
}

export const api = {
  haHa(a: string, b: string) {
    return Promise.resolve(a + b)
  },
  hbHb(a: string, b: string) {
    return Promise.resolve(a + b)
  },
};
type Api = typeof api;

interface INewApi {
  haHa(b: string): Promise<string>;

  hbHb(b: string): Promise<string>,
}
