import type { RenderResult } from '@testing-library/svelte';
import TaskItem from '$lib/components/tasks/TaskItem.svelte';
import { beforeEach, expect, type Mock } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import { testTask } from '../../../testHelpers/testTask';
import type { Task } from '$lib/types';

describe('TaskItem', () => {
	let result: RenderResult<TaskItem>;
	let eventMock: Mock;
	let onUpdate: Mock;
	let onDelete: Mock;
	let onToggleComplete: Mock;

	function renderComponent(overrides: Partial<Task> = {}) {
		if (result) result.unmount();
		eventMock = vi.fn();
		onUpdate = vi.fn();
		onDelete = vi.fn();
		onToggleComplete = vi.fn();

		result = render(TaskItem, {
			props: {
				task: { ...testTask, ...overrides },
				onUpdate: onUpdate,
				onDelete: onDelete,
				onToggleComplete: onToggleComplete
			}
		});

		result.container.addEventListener('change', eventMock);
	}

	beforeEach(() => {
		renderComponent();
	});

	it('contains a wrapper around the task', () => {
		expect(result.getByTestId('task-item')).toBeTruthy();
	});

	it('contains the text for the given task', () => {
		expect(result.getByDisplayValue(testTask.name)).toBeTruthy();
	});

	async function clickTaskToggle() {
		await act(() => {
			let text = result.getByTestId('task-item__toggle');

			fireEvent.click(text);
		});

		await waitFor(() => {
			expect(result.getByTestId('task-item__input')).toBeTruthy();
		});
	}

	it("does not bubble up the input's on change event when updating the input value", async () => {
		let input = result.getByTestId('task-item__input');

		await fireEvent.change(input, { target: { value: 'new value' } });

		expect(eventMock).not.toHaveBeenCalled();
	});

	it("the input's default value is the current task name", async () => {
		let input = result.getByTestId('task-item__input') as HTMLInputElement;

		expect(input.value).toEqual(testTask.name);
	});

	it('contains a save button when it is in input mode', async () => {
		let save = result.getByTestId('task-item__save');

		expect(save).toBeInTheDocument();
	});

	it('clicking the save button calls the onUpdate method', async () => {
		let input = result.getByTestId('task-item__input');
		await act(async () => {
			await fireEvent.change(input, { target: { value: 'test value' } });
		});
		let button = result.getByTestId('task-item__save');
		await fireEvent.click(button);

		expect(onUpdate).toHaveBeenCalled();

		let { name, taskId } = onUpdate.mock.lastCall[0];

		expect(name).toEqual('test value');
		expect(taskId).toEqual(testTask.taskId);
	});

	it('contains a button to delete the task when in edit mode', async () => {
		let deleteButton = result.getByTestId('task-item__delete');

		expect(deleteButton).toBeInTheDocument();
	});

	it('clicking the delete button calls the onDelete method with the given task', async () => {
		let deleteButton = result.getByTestId('task-item__delete');

		await fireEvent.click(deleteButton);

		expect(onDelete).toHaveBeenCalled();
		let taskId = onDelete.mock.lastCall[0];

		expect(taskId).toEqual(testTask.taskId);
	});

	it("contains a 'complete task' checkbox", () => {
		let completeCheckbox = result.getByTestId('task-item__complete');

		expect(completeCheckbox).toBeInTheDocument();
	});

	it('checking the complete task checkbox calls the onToggleComplete callback', async () => {
		let completeCheckbox = result.getByTestId('task-item__complete');

		await fireEvent.click(completeCheckbox);

		expect(onToggleComplete).toHaveBeenCalledWith(testTask.taskId);
	});

	it('the complete checkbox is checked if the task is already complete', async () => {
		renderComponent({ isCompleted: true });

		let completeCheckbox = result.getByTestId('task-item__complete');

		expect(completeCheckbox).toBeChecked();
	});
});
