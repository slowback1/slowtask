import type { RenderResult } from '@testing-library/svelte';
import TaskPage from '$lib/pages/TaskPage.svelte';
import { afterEach, beforeEach } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import TaskStore from '$lib/store/taskStore';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import { testTask } from '../../testHelpers/testTask';
import type { Task } from '$lib/types';
import STORAGE_KEYS from '$lib/store/storageKeys';

let storageMock = getLocalStorageMock();

describe('TaskPage', () => {
	let result: RenderResult<TaskPage>;

	function renderComponent(tasks: Task[] = []) {
		if (result) result.unmount();

		result = render(TaskPage, { props: { storageProvider: storageMock, tasks: tasks } });
	}

	beforeEach(() => {
		renderComponent();
	});

	function addTestTask() {
		let store = new TaskStore(storageMock);

		store.add(testTask);

		renderComponent(store.getAll());
	}

	it('contains a container list', () => {
		let taskList = result.getByTestId('task-list');

		expect(taskList).toBeTruthy();
	});

	it('displays the text of the task when there is a task', () => {
		addTestTask();

		expect(result.getByText(testTask.name)).toBeTruthy();
	});

	it('contains an add task button', () => {
		expect(result.getByTestId('add-task-button')).toBeTruthy();
	});

	it('clicking the add task button adds a task to the store', () => {
		let button = result.getByTestId('add-task-button');

		fireEvent.click(button);

		expect(storageMock.getItem(STORAGE_KEYS.TASKS).length).toBeGreaterThan(0);
	});

	it('clicking on a task turns it into an editable field', async () => {
		addTestTask();

		await act(async () => {
			let taskItem = result.getAllByTestId('task-item__toggle')[0];
			await fireEvent.click(taskItem);
		});
		await waitFor(() => {
			expect(result.container.querySelector('input')).toBeTruthy();
		});
	});
});
