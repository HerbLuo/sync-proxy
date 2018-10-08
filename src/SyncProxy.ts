import { isFunction, isPromiseLike } from "./utils/utils";
import { Not } from "./utils/tsp";

type UnWarpPromise<T> = T extends Promise<infer U> ? U : T;
type ArgumentTypes<T> = T extends (...args: infer U) => any ? U : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
type UnWarpPromiseReturningFunction<F> = ReplaceReturnType<F, UnWarpPromise<ReturnType<F>>>;

type UnWarpPropertyValue<T> = T extends Function
    ? UnWarpPromiseReturningFunction<T>
    : UnWarpPromise<T>

export type SyncProxyL1<T> = {
    [P in keyof T]: UnWarpPropertyValue<T[P]>;
}

// p2 is an object or
// objectPromise which
// defines several properties that typing
// promiseReturningFunc or
// promise or
// any -> (we will convert it to promise silently)
function createP2(p2: Promise<{}> | Not<Function>) {
    if (!isPromiseLike(p2)) {
        return p2
    }

    return new Proxy(p2, {
        get(_, ppKey, receiver) {
            // console.log(ppKey);
            if (ppKey === 'then') {
                return p2[ppKey].bind(p2)
            }

            // console.log(ppKey);

            return new Proxy(() => {}, {
                get(target, key, receiver) {
                    if (key === 'then') {
                        return async (handler: any) => {
                            const p2o = await p2;
                            const ppValue = p2o[ppKey];
                            handler(ppValue)
                        }
                    }
                    return undefined
                },
                async apply(target, ctx, args) {
                    const p2o = await p2;
                    const ppValue = p2o[ppKey];
                    // invalid
                    if (!isFunction(ppValue)) {
                        if (typeof console === "object") {
                            console.warn("value of %s isn't a function", ppKey);
                        }
                        return ppValue
                    }
                    return Reflect.apply(ppValue, p2o, args)
                }
            });
        },
        // apply (target, ctx, args) {
        //     console.log('apply');
        //     return Reflect.apply(p2, ctx, args)
        // }
    })
}

export function syncObjectProxyL1<T extends object>(target: T): SyncProxyL1<T> {
    const createP1 = (p1: (...a1: any[]) => Promise<{}>) => (...a1: any[]) =>
        createP2(Reflect.apply(p1, target, a1));

    return (new Proxy(target, {
        get(target, key, receiver) {
            // aOrARF is an object or
            // a func which returning an object,
            // the object defines several properties which is
            // promiseReturningFunc or
            // promise or
            // any
            const aOrARF = Reflect.get(target, key, receiver);
            return isFunction(aOrARF) ? createP1(aOrARF) : createP2(aOrARF);
        }
    })) as any;
}
