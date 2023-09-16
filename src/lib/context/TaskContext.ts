import {
	type Invalidator,
	type Subscriber,
	type Unsubscriber,
	type Writable,
	writable
} from 'svelte/store';
import TaskStore from '$lib/store/taskStore';
import type { Task } from '$lib/types';

export default class TaskContext {
	public subscribe: (
		this: void,
		run: Subscriber<Task[]>,
		invalidate?: Invalidator<Task[]>
	) => Unsubscriber;
	private readonly setValues: (this: void, value: Task[]) => void;
	private readonly store: TaskStore;
	private constructor(store: Writable<Task[]>) {
		this.subscribe = store.subscribe;
		this.setValues = store.set;
		if (window) this.store = new TaskStore(window.localStorage);
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
		this.setValues(this.store.getAll());
	}

	subscribeToId(id: string, callback: (task: Task) => void) {
		return this.subscribe((tasks) => {
			let task = tasks.find((t) => t.taskId === id);

			if (task) callback(task);
		});
	}

	static Create() {
		let initialState: Task[] = [];
		if (window) initialState = new TaskStore(window.localStorage).getAll();
		let store = writable(initialState);

		return new TaskContext(store);
	}
}