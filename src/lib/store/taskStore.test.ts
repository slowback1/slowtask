import TaskStore from '$lib/store/taskStore';
import type IStorageProvider from '$lib/store/IStorageProvider';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import { testTask } from '../../testHelpers/testTask';
import STORAGE_KEYS from '$lib/store/storageKeys';
import { beforeEach } from 'vitest';

describe('taskStore', () => {
	let store: TaskStore;
	let storageProvider: IStorageProvider;

	beforeEach(() => {
		storageProvider = getLocalStorageMock();
		store = new TaskStore(storageProvider);
	});

	function addTask() {
		store.add(testTask);
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
	});

	describe('getting all tasks', () => {
		it('returns an array of all of the stored tasks', () => {
			addTask();
			addTask();
			addTask();

			let results = store.getAll();

			expect(results.length).toEqual(3);

			results.forEach((result) => {
				expect(result.taskId).toEqual(testTask.taskId);
			});
		});

		it('returns an empty array when the store is not initialized with any tasks', () => {
			let result = store.getAll();

			expect(result).toEqual([]);
		});
	});
});
