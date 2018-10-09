// making async [call] chain
// to the sync [call] chain,
// get the Promise<result> from the tail item.
export type UnWarpIfPromise<T> = T extends Promise<infer U> ? U : T;
export type ArgumentTypes<T> = T extends (...args: infer U) => any ? U : never;
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
export type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;

export type WithSyncUnWarpPromise<T> = SyncProxyLN<UnWarpIfPromise<T> & T>
export type UnWarpPropertyValueLN<T> = T extends Function
    ? ReplaceReturnType<T, WithSyncUnWarpPromise<ReturnType<T>>>
    : WithSyncUnWarpPromise<T>;
export type SyncProxyLN<T> = {
    [P in keyof T]: UnWarpPropertyValueLN<T[P]>;
}

export type SyncProxy<T> = SyncProxyLN<T>;
