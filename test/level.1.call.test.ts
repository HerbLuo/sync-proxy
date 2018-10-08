import { expect } from 'chai';
import { apiSync, SUCCESS_STR } from "./api";

describe('SyncProxy test', () => {
    it ('level 1 call', async () => {
        expect(apiSync.success).to.equal(SUCCESS_STR);

        expect(await apiSync.successPromise).to.equal(SUCCESS_STR);

        expect(apiSync.successReturningFunc('a', 'b')).to.equal(SUCCESS_STR);

        expect(await apiSync.successPromiseReturningFunc('c', 'd')).to.equal(SUCCESS_STR);
    });
});
