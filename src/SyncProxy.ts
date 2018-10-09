import { isFunction, isObject, isPromiseLike } from "./utils/utils";
import { Not } from "./utils/tsp";
import {
    ArgumentTypes,
    ReplaceReturnType, ReturnType,
    SyncProxy,
    SyncProxyLN,
    UnWarpIfPromise, UnWarpPropertyValueLN, WithSyncUnWarpPromise
} from "./utils/types";

const promiseProperties: string[] = ["then", "catch", "finally"];

// // p2 is an object or
// // objectPromise which
// // defines several properties that typing
// // promiseReturningFunc or
// // promise or
// // any -> (we will convert it to promise silently)
// function createP2(p2: Promise<{}> | Not<Function>) {
//     if (!isPromiseLike(p2)) {
//         return p2
//     }
//
//     return new Proxy(p2, {
//         get(_, ppKey, receiver) {
//             // console.log(ppKey);
//             if (ppKey === 'then') {
//                 return p2[ppKey].bind(p2)
//             }
//
//             // console.log(ppKey);
//
//             return new Proxy(() => {}, {
//                 get(target, key, receiver) {
//                     if (key === 'then') {
//                         return async (handler: any) => {
//                             const p2o = await p2;
//                             const ppValue = p2o[ppKey];
//                             handler(ppValue)
//                         }
//                     }
//                     return undefined
//                 },
//                 async apply(target, ctx, args) {
//                     const p2o = await p2;
//                     const ppValue = p2o[ppKey];
//                     // invalid
//                     if (!isFunction(ppValue)) {
//                         if (typeof console === "object") {
//                             console.warn("value of %s isn't a function", ppKey);
//                         }
//                         return ppValue
//                     }
//                     return Reflect.apply(ppValue, p2o, args)
//                 }
//             });
//         },
//         // apply (target, ctx, args) {
//         //     console.log('apply');
//         //     return Reflect.apply(p2, ctx, args)
//         // }
//     })
// }
//
// export function syncObjectProxy<T extends object>(target: T): SyncProxy<T> {
//     const createP1 = (p1: (...a1: any[]) => Promise<{}>) => (...a1: any[]) =>
//         createP2(Reflect.apply(p1, target, a1));
//
//     return (new Proxy(target, {
//         get(target, key, receiver) {
//             // aOrARF is an object or
//             // a func which returning an object,
//             // the object defines several properties which is
//             // promiseReturningFunc or
//             // promise or
//             // any
//             const aOrARF = Reflect.get(target, key, receiver);
//             return isFunction(aOrARF) ? createP1(aOrARF) : createP2(aOrARF);
//         }
//     })) as any;
// }


function withSyncUnWarpPromise<T>(promise: T): WithSyncUnWarpPromise<T> {
    // obj is a promise or sync-data
    if (!isPromiseLike(promise)) {
        console.log('--------- is not promise', promise);
        return promise as any
    }

    console.log('----- is a promise');

    return new Proxy({}, {
        get(target: any, key: string, receiver): WithSyncUnWarpPromise<T> {
            // target key is
            // then, catch, finally and etc,
            // it means this access is the last step,
            // so we needn't do proxy ..
            if (promiseProperties.includes(key)) {
                return (promise as any)[key].bind(promise)
            }

            // const resultP =
            return new Proxy(() => {}, {
                get(target: any, _key: string, receiver: any) {
                    if (_key === 'then') {
                        return async (handler: any) => {
                            const p2o = await promise;
                            const ppValue = p2o[key];
                            handler(ppValue)
                        }
                    }
                },
                async apply(target: any, ctx: any, args: any[]) {
                    const resolvedObject = await promise;
                    const value = resolvedObject[key];
                    return Reflect.apply(value, resolvedObject, args)
                }
            })
        }
    })
}

function unWarpIfReturnTypeIsPromise<T extends Function>(func: T)
    : ReplaceReturnType<T, WithSyncUnWarpPromise<ReturnType<T>>> {
    return new Proxy(func, {
        apply(target: any, ctx: any, args: ArgumentTypes<T>)
            : WithSyncUnWarpPromise<ReturnType<T>> {
            console.log('--------- applying');
            const result: ReturnType<T> = Reflect.apply(target, ctx, args);
            console.log('--------- resulting');
            return withSyncUnWarpPromise(result);
        }
    })
}

function syncProxyLN<T>(obj: T): SyncProxyLN<T> {
    if (!isObject(obj)) {
        console.log('is not obj', obj);
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
