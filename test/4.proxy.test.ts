import { expect } from 'chai';
import { apiSync, SUCCESS_STR } from "./api";

const proxied = new Proxy(apiSync, {
    get(target, key, receiver) {
        return Reflect.get(target, key, receiver)
    }
});

describe('SyncProxy test for proxy', () => {
    it ('level 1 call', async () => {
        expect(proxied.success).to.equal(SUCCESS_STR);
        expect(await proxied.api.promisedApi.successPromiseReturningFunc('a', 'b'))
            .to.equal(SUCCESS_STR);
    });

    it('', async () => {
        expect(apiSync.getResultProxy().successReturningFunc()).to.equal(SUCCESS_STR)
    })
});
