import type { RenderResult } from '@testing-library/svelte';
import TaskPage from '$lib/pages/TaskPage.svelte';
import { afterEach, beforeEach } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import { testTask } from '../../testHelpers/testTask';
import type { Task } from '$lib/types';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import TaskService from '$lib/services/taskService';

let storageMock = getLocalStorageMock();

describe('TaskPage', () => {
	let result: RenderResult<TaskPage>;

	afterEach(() => {
		MessageBus.clear(Messages.TaskData);
	});

	function renderComponent() {
		if (result) result.unmount();

		result = render(TaskPage);
	}

	beforeEach(() => {
		renderComponent();
	});

	function addTestTask() {
		let store = new TaskService();

		store.add(testTask);

		renderComponent();
	}

	it('contains a container list', () => {
		let taskList = result.getByTestId('task-list');

		expect(taskList).toBeTruthy();
	});

	it('displays the text of the task when there is a task', async () => {
		addTestTask();

		expect(result.getByText(testTask.name)).toBeTruthy();
	});

	it('contains an add task button', () => {
		expect(result.getByTestId('add-task-button')).toBeTruthy();
	});

	it('clicking the add task button adds a task to the store', () => {
		let button = result.getByTestId('add-task-button');

		fireEvent.click(button);

		let currentValue = MessageBus.getLastMessage<Task[]>(Messages.TaskData);

		expect(currentValue.length).toBeGreaterThan(0);
	});

	async function toggleEditModeForFirstTask() {
		await act(async () => {
			let taskItem = result.getAllByTestId('task-item__toggle')[0];
			await fireEvent.click(taskItem);
		});
	}

	it('clicking on a task turns it into an editable field', async () => {
		addTestTask();
		await toggleEditModeForFirstTask();
		await waitFor(() => {
			expect(result.container.querySelector('input')).toBeTruthy();
		});
	});

	it('clicking the delete button deletes the task', async () => {
		addTestTask();
		await toggleEditModeForFirstTask();

		let beforeTaskCount = 1;

		let deleteButton = result.getByTestId('task-item__delete');
		await fireEvent.click(deleteButton);

		let afterTaskCount = MessageBus.getLastMessage<Task[]>(Messages.TaskData).length;

		expect(beforeTaskCount).greaterThan(afterTaskCount);
	});

	it('clicking the toggle complete button toggles the completed status of the task', async () => {
		addTestTask();

		let toggle = result.getAllByTestId('task-item__complete')[0];

		await fireEvent.click(toggle);

		let firstTask: Task = MessageBus.getLastMessage<Task[]>(Messages.TaskData)[0];

		expect(firstTask.isCompleted).toEqual(true);
	});

	it('clicking the toggle button twice toggles the completed status back off', async () => {
		addTestTask();

		let toggle = result.getAllByTestId('task-item__complete')[0];

		await fireEvent.click(toggle);
		await fireEvent.click(toggle);

		let firstTask: Task = MessageBus.getLastMessage(Messages.TaskData)[0];

		expect(firstTask.isCompleted).toEqual(false);
	});
});
