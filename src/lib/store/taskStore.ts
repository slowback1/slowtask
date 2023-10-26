import type { Task } from '$lib/types';
import STORAGE_KEYS from '$lib/store/storageKeys';
import BaseStore from '$lib/store/BaseStore';

export default class TaskStore extends BaseStore<Task, Task[]> {
	_storageKey = STORAGE_KEYS.TASKS;

	private getCurrentTasks(): Task[] {
		let currentTasks = this.getFromStorage();

		if (currentTasks) {
			let parsed = JSON.parse(currentTasks) as Task[];

			return parsed.map((task) => ({
				...task,
				dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
				createdDate: task.createdDate ? new Date(task.createdDate) : undefined
			}));
		}

		return [];
	}

	private generateUniqueId() {
		return (Math.random() + 1).toString(36).substring(2);
	}

	add(task: Task): Task {
		let taskList = this.getCurrentTasks();

		task = { ...task, taskId: this.generateUniqueId() };

		taskList.push(task);

		this.saveChanges(taskList);

		return task;
	}

	get(): Task[] {
		return this.getCurrentTasks();
	}

	getById(id: string): Task {
		let tasks = this.getCurrentTasks();

		return tasks.find((t) => t.taskId == id);
	}

	update(id: string, updatedValue: Task) {
		return this.updateTask(id, updatedValue);
	}

	private updateTask(id: string, updatedValue: Task) {
		let tasks = this.get();

		let index = tasks.findIndex((t) => t.taskId === id);

		tasks[index] = updatedValue;

		this.saveChanges(tasks);
	}

	markComplete(id: string): Task {
		let task = this.getById(id);

		task.isCompleted = true;

		this.updateTask(id, task);

		return task;
	}

	delete(id: string): Task[] {
		let tasks = this.get().filter((t) => t.taskId !== id);

		this.saveChanges(tasks);

		return tasks;
	}

	setTasks(tasks: Task[]) {
		this.saveChanges(tasks);
	}
}
