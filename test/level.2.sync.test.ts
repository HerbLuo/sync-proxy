import { expect } from 'chai'
import { apiSync, SUCCESS_STR } from "./api";

describe('SyncProxy test level 2', () => {
  it('level 2 sync', async () => {
    expect(await apiSync.promisedApi
      .successPromiseReturningFunc('e', 'f')
    ).to.equal(SUCCESS_STR);

    expect(await apiSync.promiseApiReturningFunc('g')
      .successPromiseReturningFunc('h', 'i')
    ).to.equal(SUCCESS_STR);

    expect(await apiSync.promisedApi.success).to.equal(SUCCESS_STR);

    expect(await apiSync.promisedApi.successPromise).to.equal(SUCCESS_STR);

    expect(await apiSync.promiseApiReturningFunc('j').success)
      .to.equal(SUCCESS_STR);

    expect(await apiSync.promiseApiReturningFunc('k').successPromise)
      .to.equal(SUCCESS_STR)
  });
});
