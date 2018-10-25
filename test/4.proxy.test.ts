import { expect } from 'chai';
import { apiSync, SUCCESS_STR } from "./api";
import {Api4Proxy, lApi} from "./api.4.proxy";
import {syncProxy} from "../src/SyncProxy";

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

    it('getResultProxy', async () => {
        expect(apiSync.getResultProxy().successReturningFunc()).to.equal(SUCCESS_STR)
    });

    it('for proxy', async () => {
        const api = new Api4Proxy(lApi);
        const syncApi = syncProxy(api);
        const result = await syncApi
            .doA('s')
            .haHa('okk');
        console.log(result);
    })
});
