export type Task = {
	taskId: string;
	name: string;
	details: string;
	dueDate?: Date;
	createdDate: Date;
	isCompleted: boolean;
};
export type HTMLInputEvent = Event & { target?: { value?: string } };

export type ApiConfig = {
	api_url: string;
	auth_token: string;
	api_key: string;
};

export type ApiData = {
	created_at?: string;
	task_data: any;
	key: string;
};

export interface IApiPayload {
	version: string;
	key: string;
}

export interface ApiPayloadV1_0_0 extends IApiPayload {
	tasks: Task[];
}

export type UserStoreType = {
	key: string;
};
