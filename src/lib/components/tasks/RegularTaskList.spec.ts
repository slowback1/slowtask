import type { RenderResult } from '@testing-library/svelte';
import { fireEvent, render } from '@testing-library/svelte';
import RegularTaskList from '$lib/components/tasks/RegularTaskList.svelte';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import RegularTaskService from '$lib/services/regularTaskService';
import { type RegularTask, type RegularTaskModalState, RegularTaskScheduleType } from '$lib/types';
import { Messages } from '$lib/bus/Messages';
import { addDays } from '$lib/utils/dateUtils';

describe('RegularTaskList', () => {
	let result: RenderResult<RegularTaskList>;

	function renderComponent(overrides: any = {}) {
		let props = {
			...overrides
		};

		if (result) result.unmount();

		result = render(RegularTaskList, { props });
	}

	beforeEach(() => {
		MessageBus.clearAll();
		new RegularTaskService().addRegularTask(
			'test regular task',
			RegularTaskScheduleType.Daily,
			new Date()
		);

		renderComponent();
	});

	it('renders a regular task item in the list', () => {
		let taskItem = result.getByTestId('regular-task-item');

		expect(taskItem).toBeInTheDocument();
	});

	it('contains a wrapper for the task items', () => {
		let listWrapper = result.getByTestId('regular-task-list');

		expect(listWrapper).toBeInTheDocument();
	});

	it('clicking the button in the task item changes the modal state', () => {
		let taskItemButton = result.getByTestId('regular-task-item').querySelector('button');

		fireEvent.click(taskItemButton);

		let modalState = MessageBus.getLastMessage<RegularTaskModalState>(
			Messages.RegularTaskModalState
		);

		expect(modalState.isOpen).toEqual(true);
	});

	it('contains a button to add a new regular task item', () => {
		let newTaskButton = result.getByTestId('new-regular-task-item');

		expect(newTaskButton).toBeInTheDocument();
	});

	it("clicking the button adds a new 'blank' task", () => {
		let newTaskButton = result.getByTestId('new-regular-task-item');

		fireEvent.click(newTaskButton);

		let taskList = MessageBus.getLastMessage<RegularTask[]>(Messages.RegularTaskData);

		expect(taskList.length).toEqual(2);

		let newTask = taskList[1];

		expect(newTask.taskName).toEqual('');
		expect(newTask.scheduleType).toEqual(RegularTaskScheduleType.Weekly);
	});

	it('adding a task opens the modal state to the new task', () => {
		let newTaskButton = result.getByTestId('new-regular-task-item');

		fireEvent.click(newTaskButton);

		let modalState = MessageBus.getLastMessage<RegularTaskModalState>(
			Messages.RegularTaskModalState
		);

		expect(modalState.isOpen).toEqual(true);
	});

	it('contains a title for the list', () => {
		let title = result.getByTestId('regular-task-list__title');

		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('Regular Tasks');
	});
});
