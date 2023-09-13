import type IStorageProvider from '$lib/store/IStorageProvider';

export default abstract class BaseStore<T> {
	protected abstract readonly _storageKey: string;

	constructor(protected storageProvider: IStorageProvider) {}

	abstract add(thing: T): void;
	abstract getAll(): T[];

	protected saveChanges(value: T[]) {
		this.storageProvider.setItem(this._storageKey, JSON.stringify(value));
	}
}
