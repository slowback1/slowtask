import TaskStore from '$lib/store/taskStore';
import type IStorageProvider from '$lib/store/IStorageProvider';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import { testTask } from '../../testHelpers/testTask';
import STORAGE_KEYS from '$lib/store/storageKeys';
import { beforeEach, describe } from 'vitest';
import type { Task } from '$lib/types';

describe('taskStore', () => {
	let store: TaskStore;
	let storageProvider: IStorageProvider;

	beforeEach(() => {
		storageProvider = getLocalStorageMock();
		store = new TaskStore(storageProvider);
	});

	function addTask() {
		return store.add(testTask);
	}

	describe('adding tasks', () => {
		it('adding a task adds it to the store with the correct key', () => {
			store.add(testTask);

			let storedValue = storageProvider.getItem(STORAGE_KEYS.TASKS);

			expect(storedValue).not.toBeUndefined();
		});

		it('adding a task adds it to the store as an array', () => {
			store.add(testTask);

			let storedValue = storageProvider.getItem(STORAGE_KEYS.TASKS);

			let parsed = JSON.parse(storedValue);

			expect(Array.isArray(parsed)).toBeTruthy();
		});

		it('when adding two tasks back to back, concatenates the array in the store', () => {
			store.add(testTask);
			store.add(testTask);

			let storedValue = storageProvider.getItem(STORAGE_KEYS.TASKS);
			let parsed = JSON.parse(storedValue);

			expect(parsed.length).toEqual(2);
		});

		it('adding a task returns the added task', () => {
			let result = store.add(testTask);

			expect(result.name).toEqual(testTask.name);
		});

		it('adding a task generates a unique id', () => {
			let result = store.add(testTask);

			expect(result.taskId).not.toEqual('test-id');

			let result2 = store.add(testTask);

			expect(result.taskId).not.toEqual(result2.taskId);
		});
	});

	describe('getting all tasks', () => {
		it('returns an array of all of the stored tasks', () => {
			addTask();
			addTask();
			addTask();

			let results = store.getAll();

			expect(results.length).toEqual(3);
		});

		it('returns an empty array when the store is not initialized with any tasks', () => {
			let result = store.getAll();

			expect(result).toEqual([]);
		});
	});

	describe('getting a single task', () => {
		it('returns the task of the id', () => {
			var stored = addTask();

			let result = store.getById(stored.taskId);

			expect(result).toEqual(stored);
		});

		it('returns undefined if the task does not exist', () => {
			addTask();

			let result = store.getById('i-dont-exist');

			expect(result).toEqual(undefined);
		});
	});

	describe('marking a task as completed', () => {
		let taskId: string;

		beforeEach(() => {
			let task = store.add(testTask);

			taskId = task.taskId;
		});

		it('returns the task', () => {
			let completedTask = store.markComplete(taskId);

			expect(completedTask.taskId).toEqual(taskId);
		});

		it('updates the task to be complete', () => {
			let completedTask = store.markComplete(taskId);

			expect(completedTask.isCompleted).toEqual(true);
		});

		it('updates the store', () => {
			let completedTask = store.markComplete(taskId);

			let stored = JSON.parse(storageProvider.getItem(STORAGE_KEYS.TASKS)) as Task[];

			let newlyCompletedTask = stored[0];

			expect(newlyCompletedTask.isCompleted).toEqual(true);
		});
	});

	describe('deleting a task', () => {
		let taskId: string;

		beforeEach(() => {
			let task = addTask();

			taskId = task.taskId;
		});

		it('can delete a task', () => {
			let remainingTasks = store.delete(taskId);

			expect(remainingTasks.length).toEqual(0);
		});

		it('removes from the store', () => {
			store.delete(taskId);

			let stored = JSON.parse(storageProvider.getItem(STORAGE_KEYS.TASKS)) as Task[];

			expect(stored.length).toEqual(0);
		});
	});

	describe('updating tasks', () => {
		let task: Task;

		beforeEach(() => {
			task = addTask();
		});

		it.each([
			['name', 'new name'],
			['details', 'new details'],
			['dueDate', new Date(1994, 2, 17)],
			['createdDate', new Date(1994, 2, 17)],
			['isCompleted', true]
		])('can update %s', (key, value) => {
			let updated = store.update(task.taskId, { ...task, [key]: value });

			let stored = store.getAll();

			expect(stored[0][key]).toEqual(value);
		});
	});
});
