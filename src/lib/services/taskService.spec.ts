import type { Task } from '$lib/types';
import { afterEach, beforeAll, beforeEach, expect } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import TaskService from '$lib/services/taskService';
import { testTask } from '../../testHelpers/testTask';

describe('TaskService', () => {
	let currentTaskList: Task[] = [];
	let taskService = new TaskService();

	beforeAll(() => {
		MessageBus.subscribe<Task[]>(Messages.TaskData, (value) => (currentTaskList = value ?? []));
	});

	beforeEach(() => {
		taskService = new TaskService();
	});

	afterEach(() => {
		MessageBus.clear(Messages.TaskData);
	});

	it('can add a task and update the message bus', () => {
		taskService.add(testTask);

		expect(currentTaskList.length).toEqual(1);

		let valueToCompare = { ...currentTaskList[0], taskId: testTask.taskId };
		valueToCompare.dueDate = new Date(valueToCompare.dueDate);
		valueToCompare.createdDate = new Date(valueToCompare.createdDate);

		expect(valueToCompare).toEqual(testTask);
	});

	it('can add two tasks and have them persist in the message bus', () => {
		taskService.add(testTask);
		taskService.add(testTask);

		expect(currentTaskList.length).toEqual(2);
	});

	it('when adding a task, generates a unique id', () => {
		taskService.add(testTask);

		expect(currentTaskList[0].taskId).not.toEqual(testTask.taskId);
	});

	describe('updating tasks', () => {
		let currentTaskId = '';

		beforeEach(() => {
			taskService.add(testTask);

			currentTaskId = currentTaskList[0].taskId;
		});

		it.each([
			['createdDate', new Date(2023, 1, 1)],
			['details', 'something else'],
			['dueDate', new Date(2024, 1, 1)],
			['name', 'new name'],
			['isCompleted', true]
		])('can update the %s field', (key, value) => {
			taskService.update(currentTaskId, { [key]: value });

			expect(currentTaskList[0][key]).toEqual(value);
		});

		it('does nothing when given an invalid task id', () => {
			taskService.update('this really should not be the task id I hope', {});

			expect(currentTaskList[0]).toBeDefined();
			expect(currentTaskList.length).toEqual(1);
		});
	});

	describe('deleting tasks', () => {
		let currentTaskId = '';

		beforeEach(() => {
			taskService.add(testTask);

			currentTaskId = currentTaskList[0].taskId;
		});

		it('can delete a task', () => {
			taskService.delete(currentTaskId);

			expect(currentTaskList.length).toEqual(0);
		});

		it('does nothing when given an invalid task id', () => {
			taskService.delete("something that doesn't exist");

			expect(currentTaskList.length).toEqual(1);
		});
	});
});
