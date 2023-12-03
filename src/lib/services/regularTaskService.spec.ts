import type { RegularTask, Task } from '$lib/types';
import { RegularTaskScheduleType } from '$lib/types';
import RegularTaskService from '$lib/services/regularTaskService';
import { afterEach, beforeEach, expect } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import { testRegularTask } from '../../testHelpers/testRegularTask';
import { waitFor } from '@testing-library/svelte';
import { addDays, addMonths } from '$lib/utils/dateUtils';

describe('RegularTaskService', () => {
	let service: RegularTaskService;

	beforeEach(() => {
		service = new RegularTaskService();
	});

	afterEach(() => {
		MessageBus.clearAll();
	});

	it('updates the regular task data as an empty array when there is no already existing data', () => {
		let data = MessageBus.getLastMessage<RegularTask[]>(Messages.RegularTaskData);

		expect(data).toEqual([]);
	});

	it('keep already existing task data intact if it already exists', () => {
		MessageBus.sendMessage(Messages.RegularTaskData, [testRegularTask]);

		service = new RegularTaskService();

		let data = MessageBus.getLastMessage<RegularTask[]>(Messages.RegularTaskData);

		expect(data).toEqual([testRegularTask]);
	});

	it('keeps a copy of the current regular task data state', () => {
		MessageBus.sendMessage(Messages.RegularTaskData, [testRegularTask]);

		expect(RegularTaskService.regularTasks).toEqual([testRegularTask]);
	});

	it('can listen for when to add a task', async () => {
		let scheduledDate = new Date();
		scheduledDate.setTime(new Date().getTime() + 1);
		let task: RegularTask = { ...testRegularTask, nextScheduledDate: scheduledDate };

		MessageBus.sendMessage(Messages.RegularTaskData, [task]);

		await waitFor(() => {
			let tasks = MessageBus.getLastMessage<Task[]>(Messages.TaskData);

			expect(tasks.length).toBeGreaterThan(0);
			expect(tasks[0].name).toEqual(task.taskName);
			expect(tasks[0].regularTaskId).toEqual(task.id);
		});
	});

	it('only adds the task exactly once', async () => {
		addATaskThatTriggersImmediately();

		await waitFor(() => {
			let tasks = MessageBus.getLastMessage<Task[]>(Messages.TaskData);

			expect(tasks.length).toEqual(1);
		});
	});

	function addATaskThatTriggersImmediately(
		taskType: RegularTaskScheduleType = RegularTaskScheduleType.Daily
	) {
		let scheduledDate = new Date();
		scheduledDate.setTime(new Date().getTime() + 1);
		let task: RegularTask = {
			...testRegularTask,
			nextScheduledDate: scheduledDate,
			scheduleType: taskType
		};

		MessageBus.sendMessage(Messages.RegularTaskData, [task]);
		return scheduledDate;
	}

	it.each([
		[RegularTaskScheduleType.Daily],
		[RegularTaskScheduleType.Monthly],
		[RegularTaskScheduleType.Weekly],
		[RegularTaskScheduleType.Annually]
	])('updates the date to the future date based on the schedule type', async (taskType) => {
		let scheduledDate = addATaskThatTriggersImmediately(taskType);

		function getExpectedDate() {
			switch (taskType) {
				case RegularTaskScheduleType.Daily:
					return addDays(scheduledDate, 1);
				case RegularTaskScheduleType.Weekly:
					return addDays(scheduledDate, 7);
				case RegularTaskScheduleType.Monthly:
					return addMonths(scheduledDate, 1);
				case RegularTaskScheduleType.Annually:
					return addMonths(scheduledDate, 12);
			}
		}

		await waitFor(() => {
			expect(RegularTaskService.regularTasks[0].nextScheduledDate).toEqual(getExpectedDate());
		});
	});

	it('can add a regular task', () => {
		service.addRegularTask('test name', RegularTaskScheduleType.Daily, new Date(3025, 1, 1));

		let tasks = RegularTaskService.regularTasks;

		expect(tasks.length).toEqual(1);

		let task = tasks[0];

		expect(task.taskName).toEqual('test name');
		expect(task.nextScheduledDate).toEqual(new Date(3025, 1, 1));
		expect(task.scheduleType).toEqual(RegularTaskScheduleType.Daily);
	});

	it('the regular task can have a different schedule type modifier', () => {
		service.addRegularTask('test name 2', RegularTaskScheduleType.Monthly, new Date(), 3);

		let tasks = RegularTaskService.regularTasks;

		expect(tasks.length).toEqual(1);

		let task = tasks[0];

		expect(task.scheduleTypeModifier).toEqual(3);
	});

	it('the added task has a random id', () => {
		service.addRegularTask('name', RegularTaskScheduleType.Annually, new Date());

		let task = RegularTaskService.regularTasks[0];

		expect(task.id).not.toEqual('');
		expect(task.id.length).toBeGreaterThan(4);
	});

	it('can update a task', () => {
		service.addRegularTask('name', RegularTaskScheduleType.Annually, new Date());

		let task = JSON.parse(JSON.stringify(RegularTaskService.regularTasks[0]));

		task.taskName = 'new name';

		service.updateRegularTask(task);

		let updatedTask = RegularTaskService.regularTasks[0];

		expect(updatedTask.taskName).toEqual('new name');
	});
});
