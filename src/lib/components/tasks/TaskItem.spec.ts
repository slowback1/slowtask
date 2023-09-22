import type { RenderResult } from '@testing-library/svelte';
import TaskItem from '$lib/components/tasks/TaskItem.svelte';
import { afterEach, beforeEach, expect, type Mock } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import { testTask } from '../../../testHelpers/testTask';

describe('TaskItem', () => {
	let result: RenderResult<TaskItem>;
	let eventMock: Mock;
	let onUpdate: Mock;

	function renderComponent() {
		if (result) result.unmount();
		eventMock = vi.fn();
		onUpdate = vi.fn();

		result = render(TaskItem, { props: { task: testTask, onUpdate: onUpdate } });

		result.container.addEventListener('change', eventMock);
	}

	beforeEach(() => {
		renderComponent();
	});

	it('contains a wrapper around the task', () => {
		expect(result.getByTestId('task-item')).toBeTruthy();
	});

	it('contains the text for the given task', () => {
		expect(result.getByText(testTask.name)).toBeTruthy();
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

	it('clicking the text turns it into an input', async () => {
		await clickTaskToggle();

		await waitFor(() => {
			expect(result.getByTestId('task-item__input')).toBeTruthy();
		});
	});

	it("does not bubble up the input's on change event when updating the input value", async () => {
		await clickTaskToggle();

		let input = result.getByTestId('task-item__input');

		await fireEvent.change(input, { target: { value: 'new value' } });

		expect(eventMock).not.toHaveBeenCalled();
	});

	it("the input's default value is the current task name", async () => {
		await clickTaskToggle();

		let input = result.getByTestId('task-item__input') as HTMLInputElement;

		expect(input.value).toEqual(testTask.name);
	});

	it('contains a save button when it is in input mode', async () => {
		await clickTaskToggle();

		let save = result.getByTestId('task-item__save');

		expect(save).toBeInTheDocument();
	});

	it('clicking the save button calls the onUpdate method', async () => {
		await clickTaskToggle();

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

	it('opening the edit mode focuses the input', async () => {
		await clickTaskToggle();

		let input = result.getByTestId('task-item__input');
		expect(input).toHaveFocus();
	});

	it('saving the task closes the edit mode', async () => {
		await clickTaskToggle();

		let button = result.getByTestId('task-item__save');
		await fireEvent.click(button);

		let toggle = result.getByTestId('task-item__toggle');

		expect(toggle).toBeInTheDocument();
	});
});
