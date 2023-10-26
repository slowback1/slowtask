import {
	type Invalidator,
	type Subscriber,
	type Unsubscriber,
	type Writable,
	writable
} from 'svelte/store';
import TaskStore from '$lib/store/taskStore';
import type { Task } from '$lib/types';
import type IStorageProvider from '$lib/store/IStorageProvider';

export default class TaskContext {
	public subscribe: (
		this: void,
		run: Subscriber<Task[]>,
		invalidate?: Invalidator<Task[]>
	) => Unsubscriber;
	private readonly setValues: (this: void, value: Task[]) => void;
	private readonly store: TaskStore;

	private constructor(store: Writable<Task[]>, storageProvider: IStorageProvider) {
		this.subscribe = this.processSubscribe(store);
		this.setValues = store.set;
		this.store = new TaskStore(storageProvider);
	}

	private processSubscribe(store: Writable<Task[]>) {
		return (run: Subscriber<Task[]>, invalidate: Invalidator<Task[]>) => {
			let unsubscribe = store.subscribe(run, invalidate);

			this.notifySubscribers();

			return unsubscribe;
		};
	}

	update(id: string, updatedValue: Task) {
		this.store.update(id, updatedValue);

		this.updateSubscribers();
	}

	add(task: Task) {
		this.store.add(task);

		this.updateSubscribers();
	}

	delete(id: string) {
		this.store.delete(id);
		this.updateSubscribers();
	}

	private updateSubscribers() {
		this.setValues(this.store.get());
	}

	subscribeToId(id: string, callback: (task: Task) => void) {
		return this.subscribe((tasks) => {
			let task = tasks.find((t) => t.taskId === id);

			if (task) callback(task);
		});
	}

	notifySubscribers() {
		this.updateSubscribers();
	}

	static Create(storageProvider: IStorageProvider) {
		let initialState: Task[] = [];
		new TaskStore(storageProvider).get();
		let store = writable(initialState);

		return new TaskContext(store, storageProvider);
	}
}
