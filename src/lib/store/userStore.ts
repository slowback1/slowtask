import BaseStore from '$lib/store/BaseStore';
import STORAGE_KEYS from '$lib/store/storageKeys';

export type UserStoreType = {
	key: string;
};

export default class UserStore extends BaseStore<UserStoreType, UserStoreType> {
	protected readonly _storageKey: string = STORAGE_KEYS.USER;

	add(user: UserStoreType): void {
		this.saveChanges(user);
	}

	get(): UserStoreType {
		let storedValue = this.getFromStorage();

		if (!storedValue) return undefined;

		return JSON.parse(storedValue);
	}
}
