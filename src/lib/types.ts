export type Task = {
	taskId: string;
	name: string;
	details: string;
	dueDate?: Date;
	createdDate: Date;
	isCompleted: boolean;
	regularTaskId?: string;
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
	playerData: PlayerData;
}

export type UserStoreType = {
	key: string;
};

export type PlayerExperience = {
	level: number;
	currentExperience: number;
	pointsToSpend: number;
};

export type PlayerStats = {
	health: number;
	attack: number;
	searching: number;
	healing: number;
	defense: number;
	gathering: number;
};

export type PlayerData = {
	experience: PlayerExperience;
	stats: PlayerStats;
	name: string;
};

export enum RegularTaskScheduleType {
	Daily,
	Weekly,
	Monthly,
	Annually
}

export type RegularTask = {
	id: string;
	taskName: string;
	scheduleType: RegularTaskScheduleType;
	scheduleTypeModifier: number;
	nextScheduledDate: Date;
};
