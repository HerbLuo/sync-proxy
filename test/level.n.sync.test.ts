import { expect } from 'chai'
import { apiSync, SUCCESS_STR } from "./api";
import { syncProxy } from "../src/SyncProxy";
import { SyncProxy, UnWarpIfPromise } from "../src/utils/types";

describe('SyncProxy Test level n', () => {
    it('level n test', async () => {
        expect(await apiSync
            .promisedApi
            .promisedApi
            .successPromiseReturningFunc('n.a', 'n.b')
        ).to.equal(SUCCESS_STR);

        expect(await apiSync
            .promisedApi
            .promisedApi
            .promisedApi
            .promisedApi
            .promisedApi
            .promisedApi
            .promisedApi
            .promisedApi
            .successPromiseReturningFunc('n.c', 'n.d')
        ).to.equal(SUCCESS_STR);


        expect(await apiSync.promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .promiseApiReturningFunc()
            .successPromiseReturningFunc('n.a', 'n.b')
        ).to.equal(SUCCESS_STR);

        const t = apiSync
            .promisedApi
            .promiseApiReturningFunc()
            .api
            .successPromiseReturningFunc('n.a', 'n.b');
        expect(await t).to.equal(SUCCESS_STR);

        expect(await apiSync
            .api
            .promisedApi
            .promiseApiReturningFunc()
            .promisedApi
            .promisedApi
            .promiseApiReturningFunc()
            .api
            .api
            .promisedApi
            .promiseApiReturningFunc()
            .successPromiseReturningFunc('n.a', 'n.b')
        ).to.equal(SUCCESS_STR)
    })
});
