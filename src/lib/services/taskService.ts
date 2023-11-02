import type { Task } from '$lib/types';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

export default class TaskService {
	add(task: Task) {
		let currentValue = this.getCurrentValue();

		let valueToAdd = JSON.parse(JSON.stringify(task));
		valueToAdd.taskId = this.generateUniqueId();

		currentValue.push(valueToAdd);
		this.updateChanges(currentValue);
	}

	update(taskId: string, value: Partial<Task>) {
		let tasks = this.getCurrentValue();

		let index = tasks.findIndex((t) => t.taskId === taskId);
		if (index === -1) return;

		tasks[index] = { ...tasks[index], ...value };

		this.updateChanges(tasks);
	}

	delete(taskId: string) {
		let tasks = this.getCurrentValue();

		let index = tasks.findIndex((t) => t.taskId === taskId);
		if (index === -1) return;

		tasks.splice(index, 1);

		this.updateChanges(tasks);
	}

	private updateChanges(currentValue: Task[]) {
		MessageBus.sendMessage(Messages.TaskData, currentValue);
	}

	private getCurrentValue() {
		return MessageBus.getLastMessage<Task[]>(Messages.TaskData) ?? [];
	}

	private generateUniqueId() {
		return (Math.random() + 1).toString(36).substring(2);
	}
}
