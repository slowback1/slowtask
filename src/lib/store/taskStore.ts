import type { Task } from '$lib/types';
import STORAGE_KEYS from '$lib/store/storageKeys';
import BaseStore from '$lib/store/BaseStore';

export default class TaskStore extends BaseStore<Task> {
	private getCurrentTasks() {
		let currentTasks = this.storageProvider.getItem(STORAGE_KEYS.TASKS);

		if (currentTasks) {
			return JSON.parse(currentTasks);
		}

		return [];
	}

	add(task: Task) {
		let taskList = this.getCurrentTasks();

		taskList.push(task);

		let json = JSON.stringify(taskList);

		this.storageProvider.setItem(STORAGE_KEYS.TASKS, json);
	}

	getAll(): Task[] {
		return this.getCurrentTasks();
	}
}
