import {
  ArgumentTypes,
  ReplaceReturnType,
  ReturnType,
  SyncProxyLN,
  WithSyncUnWarpPromise
} from "./utils/types";
import { isFunction, isObject, isPromiseLike } from "./utils/utils";

let promiseProperties: string[] = ["then", "catch", "finally"];

/**
 * un promise an object
 * if the object doesn't like a promise, return the object
 * else return a object proxy
 *
 * @param promise
 */
function withSyncUnWarpPromise<T>(promise: T): WithSyncUnWarpPromise<T> {
  // obj is a promise or sync-data
  if (!isPromiseLike(promise)) {
    return syncProxyLN(promise) as any
  }

  // proxy an object
  return new Proxy(() => void 0, {
    get(_: any, key: string): WithSyncUnWarpPromise<T> {
      // target key is
      // then, catch, finally and etc,
      // it means the result should be out,
      // so we get it as native
      if (promiseProperties.includes(key)) {
        return (promise as any)[key].bind(promise)
      }

      // the result is an object or a function

      return new Proxy(() => void 0, {
        get(__: any, key2: string) {
          if (promiseProperties.includes(key2)) {
            return (handler: any) =>
              promise // un support promise.finally
                .then(p2o => handler(p2o[key]))
                .catch(e => {
                  if (key2 === "catch") {
                    handler(e)
                  } else {
                    throw e
                  }
                })
          }
          return withSyncUnWarpPromise(promise
            .then(o => o[key])
            .then(o => {
              const value = o[key2];
              return isFunction(value) ? value.bind(o) : value
            }))
        },
        apply(__: any, ___: any, args: any[]) {
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

/**
 * un promise a function
 *
 * @param func function
 */
function unWarpIfReturnTypeIsPromise<T extends (...args: any[]) => any>(func: T)
  : ReplaceReturnType<T, WithSyncUnWarpPromise<ReturnType<T>>> {
  return new Proxy(func, {
    apply(target: any, ctx: any, args: ArgumentTypes<T>)
      : WithSyncUnWarpPromise<ReturnType<T>> {
      const result: ReturnType<T> = Reflect.apply(target, ctx, args);
      return withSyncUnWarpPromise(result);
    }
  })
}

function syncProxyLN<T>(obj: T)
  : T extends Promise<any> ? WithSyncUnWarpPromise<T> : SyncProxyLN<T> {
  if (!isObject(obj) && !isFunction(obj)) {
    return obj as any
  }

  if (isPromiseLike(obj)) {
    return withSyncUnWarpPromise(obj as any)
  }

  // is object
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

export function setPromisePropertyNames(names: string[]) {
  promiseProperties = names
}
