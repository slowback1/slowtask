import type { RenderResult } from '@testing-library/svelte';
import RegularTaskItem from '$lib/components/tasks/RegularTaskItem.svelte';
import { beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { testRegularTask } from '../../../testHelpers/testRegularTask';
import MessageBus from '$lib/bus/MessageBus';
import type { RegularTaskModalState } from '$lib/types';
import { Messages } from '$lib/bus/Messages';

describe('RegularTaskItem', () => {
	let result: RenderResult<RegularTaskItem>;

	function renderComponent(overrides = {}) {
		if (result) result.unmount();

		let props = {
			task: testRegularTask,
			...overrides
		};

		result = render(RegularTaskItem, { props });
	}

	beforeEach(() => {
		renderComponent();
	});

	it('renders the wrapper of the component', () => {
		expect(result.getByTestId('regular-task-item')).toBeInTheDocument();
	});

	it('renders the task name', () => {
		expect(result.getByText(testRegularTask.taskName)).toBeInTheDocument();
	});

	it('clicking the task name button calls the onTaskOpen callback', () => {
		let onTaskOpen = vi.fn();
		renderComponent({ onTaskOpen });

		let button = result.getByRole('button');

		fireEvent.click(button);

		expect(onTaskOpen).toHaveBeenCalled();
	});
});
