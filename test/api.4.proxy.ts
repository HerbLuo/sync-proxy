export class Api4Proxy {
    constructor(private readonly lApi: LApi) {
    }

    public doA(arg: string) {
        return this.priDoA(arg)
    }

    public async priDoA(arg: string): Promise<NewLApi> {
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

export const lApi = {
    haHa(a: string, b: string) { return Promise.resolve(a + b) },
    hbHb(a: string, b: string) { return Promise.resolve(a + b) },
};
type LApi = typeof lApi;

interface NewLApi {
    haHa(b: string): Promise<string>;
    hbHb(b: string): Promise<string>,
}
