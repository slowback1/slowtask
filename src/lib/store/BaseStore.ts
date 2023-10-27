import type IStorageProvider from '$lib/store/IStorageProvider';

export default abstract class BaseStore<TInput, TOutput> {
	protected abstract readonly _storageKey: string;

	constructor(protected storageProvider: IStorageProvider) {}

	abstract add(thing: TInput): void;

	abstract get(): TOutput;

	protected getFromStorage(): string {
		return this.storageProvider.getItem(this._storageKey);
	}

	protected saveChanges(value: TOutput) {
		this.storageProvider.setItem(this._storageKey, JSON.stringify(value));
	}

	clear() {
		this.storageProvider.setItem(this._storageKey, '');
	}
}
