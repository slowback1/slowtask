import type { RenderResult } from '@testing-library/svelte';
import TaskItem from '$lib/components/tasks/TaskItem.svelte';
import { afterEach, beforeEach, expect, type Mock } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import { testTask } from '../../../testHelpers/testTask';

describe('TaskItem', () => {
	let result: RenderResult<TaskItem>;
	let eventMock: Mock;

	function renderComponent() {
		if (result) result.unmount();
		eventMock = vi.fn();

		result = render(TaskItem, { props: { task: testTask } });

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

	it("bubbles up the input's on change event when updating the input value", async () => {
		await clickTaskToggle();

		let input = result.getByTestId('task-item__input');

		await fireEvent.change(input, { target: { value: 'new value' } });

		expect(eventMock).toHaveBeenCalled();
		let [event] = eventMock.mock.lastCall;

		expect(event.target.value).toEqual('new value');
	});

	it("the input's default value is the current task name", async () => {
		await clickTaskToggle();

		let input = result.getByTestId('task-item__input') as HTMLInputElement;

		expect(input.value).toEqual(testTask.name);
	});
});
