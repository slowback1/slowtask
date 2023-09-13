import type { Task } from '$lib/types';

export const testTask: Task = {
	taskId: 'test-id',
	createdDate: new Date(2022, 2, 2),
	details: 'test details',
	dueDate: new Date(2022, 2, 3),
	name: 'test name',
	isCompleted: false
};
