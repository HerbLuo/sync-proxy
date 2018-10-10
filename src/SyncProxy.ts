import { isFunction, isObject, isPromiseLike } from "./utils/utils";
import {
    ArgumentTypes,
    ReplaceReturnType,
    ReturnType,
    SyncProxyLN,
    WithSyncUnWarpPromise
} from "./utils/types";

const promiseProperties: string[] = ["then", "catch", "finally"];

function withSyncUnWarpPromise<T>(promise: T): WithSyncUnWarpPromise<T> {
    // obj is a promise or sync-data
    if (!isPromiseLike(promise)) {
        return syncProxyLN(promise) as any
    }

    return new Proxy(() => {}, {
        get(target: any, key: string): WithSyncUnWarpPromise<T> {
            // target key is
            // then, catch, finally and etc,
            // it means this access is the last step,
            // so we needn't do proxy ..
            if (promiseProperties.includes(key)) {
                return (promise as any)[key].bind(promise)
            }

            return new Proxy(() => {}, {
                get(target: any, _key: string) {
                    if (promiseProperties.includes(_key)) {
                        return async (handler: any) => {
                            // serial call may nt fine
                            try {
                                const p2o = await promise;
                                const ppValue = p2o[key];
                                _key === 'then' && handler(ppValue)
                            } catch (e) {
                                _key === 'catch' && handler(e)
                            }
                        }
                    }
                    return withSyncUnWarpPromise(promise
                        .then(o => o[key])
                        .then(o => {
                            const value = o[_key];
                            return isFunction(value) ? value.bind(o) : value
                        }))
                },
                apply(_: any, __: any, args: any[]) {
                    // console.log(args);
                    return withSyncUnWarpPromise(promise
                        .then(o => {
                            const f = o[key];
                            return Reflect.apply(f, o, args);
                        }))
                }
            });
        },
        apply(_, __, args) {
            return withSyncUnWarpPromise(promise
                .then(func => func(...args)))
        }
    })
}

function unWarpIfReturnTypeIsPromise<T extends Function>(func: T)
    : ReplaceReturnType<T, WithSyncUnWarpPromise<ReturnType<T>>> {
    return new Proxy(func, {
        apply(target: any, ctx: any, args: ArgumentTypes<T>)
            : WithSyncUnWarpPromise<ReturnType<T>> {
            const result: ReturnType<T> = Reflect.apply(target, ctx, args);
            return withSyncUnWarpPromise(result);
        }
    })
}

function syncProxyLN<T>(obj: T): SyncProxyLN<T> {
    if (!isObject(obj) && !isFunction(obj)) {
        return obj as any
    }

    return new Proxy(obj, {
        get(target: any, key: string, receiver: any): any {
            const value: any = Reflect.get(target, key, receiver);

            return isFunction(value)
                ? unWarpIfReturnTypeIsPromise(value)
                : withSyncUnWarpPromise(value);
        }
    })
}

export const syncProxy = syncProxyLN;
