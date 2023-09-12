import type IStorageProvider from '$lib/store/IStorageProvider';

export default abstract class BaseStore<T> {
	constructor(protected storageProvider: IStorageProvider) {}

	abstract add(thing: T): void;
	abstract getAll(): T[];
}
