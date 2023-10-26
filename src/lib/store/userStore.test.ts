import UserStore from '$lib/store/userStore';
import type IStorageProvider from '$lib/store/IStorageProvider';
import { beforeEach, expect } from 'vitest';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import STORAGE_KEYS from '$lib/store/storageKeys';

describe('UserStore', () => {
	let store: UserStore;
	let storageProvider: IStorageProvider;

	beforeEach(() => {
		storageProvider = getLocalStorageMock();
		store = new UserStore(storageProvider);
	});

	function addUser(key: string = 'test_key') {
		return store.add({ key: key });
	}

	describe('adding the user', () => {
		it('adding the user adds it to the storage with the correct key', () => {
			addUser();

			let storedValue = storageProvider.getItem(STORAGE_KEYS.USER);

			expect(storedValue).not.toBeUndefined();
		});

		it('adding the user twice replaces the user', () => {
			addUser();
			addUser('something_else');

			let storedValue = storageProvider.getItem(STORAGE_KEYS.USER);

			let parsedValue = JSON.parse(storedValue);
			expect(parsedValue.key).toEqual('something_else');
		});
	});

	describe('getting the user', () => {
		beforeEach(() => {
			addUser();
		});

		it('can get the user', () => {
			let result = store.get();

			expect(result.key).toEqual('test_key');
		});
	});
});
