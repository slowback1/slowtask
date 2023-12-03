import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import type { RegularTask, Task } from '$lib/types';
import TaskService from '$lib/services/taskService';
import { RegularTaskScheduleType } from '$lib/types';
import { addDays, addMonths } from '$lib/utils/dateUtils';

export default class RegularTaskService {
	static regularTasks: RegularTask[];
	static listener: NodeJS.Timeout;
	private static unsubscribe: () => void;

	constructor() {
		this.initializeMessageBusData();

		if (!RegularTaskService.unsubscribe) RegularTaskService.subscribeToMessages();

		if (!RegularTaskService.listener) RegularTaskService.listenToTasks();
	}

	addRegularTask(
		name: string,
		scheduleType: RegularTaskScheduleType,
		firstDate: Date,
		scheduleTypeModifier: number = 1
	) {
		let task: RegularTask = {
			taskName: name,
			scheduleType,
			nextScheduledDate: firstDate,
			id: this.getRandomId(),
			scheduleTypeModifier
		};

		RegularTaskService.regularTasks.push(task);

		MessageBus.sendMessage(Messages.RegularTaskData, RegularTaskService.regularTasks);
	}

	updateRegularTask(task: RegularTask) {
		RegularTaskService.updateTask(task);
	}

	private getRandomId() {
		return Math.random().toString(21).padStart(21, '0');
	}

	private initializeMessageBusData() {
		let data = MessageBus.getLastMessage(Messages.RegularTaskData);

		if (!data || !Array.isArray(data)) MessageBus.sendMessage(Messages.RegularTaskData, []);
	}

	private static subscribeToMessages() {
		this.unsubscribe = MessageBus.subscribe<RegularTask[]>(Messages.RegularTaskData, (value) => {
			RegularTaskService.regularTasks = value ?? [];
		});
	}

	private static listenToTasks() {
		this.listener = setInterval(() => {
			RegularTaskService.regularTasks.forEach((task) => {
				if (this.isTaskReadyToBeAdded(task)) {
					this.addTask(task);
					this.setNextScheduledDate(task);
				}
			});
		}, 500);
	}

	private static setNextScheduledDate(task: RegularTask) {
		task.nextScheduledDate = this.getNextScheduledDate(task.scheduleType, task.nextScheduledDate);

		this.updateTask(task);
	}

	private static updateTask(task: RegularTask) {
		let index = RegularTaskService.regularTasks.findIndex((i) => i.id === task.id);

		RegularTaskService.regularTasks[index] = task;

		MessageBus.sendMessage(Messages.RegularTaskData, this.regularTasks);
	}

	private static getNextScheduledDate(taskType: RegularTaskScheduleType, scheduledDate: Date) {
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

	private static addTask(task: RegularTask) {
		let service = new TaskService();

		service.add({
			regularTaskId: task.id,
			taskId: '',
			name: task.taskName,
			isCompleted: false,
			createdDate: new Date(),
			details: ''
		});
	}

	private static isTaskReadyToBeAdded(task: RegularTask) {
		let now = new Date();
		let nextScheduledDate = new Date(task.nextScheduledDate);

		return now > nextScheduledDate;
	}
}
