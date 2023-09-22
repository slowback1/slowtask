export type Task = {
	taskId: string;
	name: string;
	details: string;
	dueDate?: Date;
	createdDate: Date;
	isCompleted: boolean;
};
export type HTMLInputEvent = Event & { target?: { value?: string } };
