import BaseStore from '$lib/store/BaseStore';
import STORAGE_KEYS from '$lib/store/storageKeys';

export type UserStoreType = {
	key: string;
};

export type UserStoreOutput = UserStoreType & {
	username: string;
};

export default class UserStore extends BaseStore<UserStoreType, UserStoreOutput> {
	protected readonly _storageKey: string = STORAGE_KEYS.USER;

	add(user: UserStoreType): void {
		let userName = atob(user.key);

		this.saveChanges({ key: user.key, username: userName });
	}

	get(): UserStoreOutput {
		let storedValue = this.getFromStorage();

		if (!storedValue) return undefined;

		return JSON.parse(storedValue);
	}
}
