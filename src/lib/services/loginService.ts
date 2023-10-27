import type IStorageProvider from '$lib/store/IStorageProvider';
import API from '$lib/api/api';
import UserStore from '$lib/store/userStore';
import TaskStore from '$lib/store/taskStore';
import type { ApiData, ApiPayloadV1_0_0 } from '$lib/types';

export default class LoginService {
	constructor(private storageProvider: IStorageProvider) {}

	errorMessage: string = '';

	async logIn(username: string, password: string) {
		let result = await this.fetchLogin(username, password);

		if (!this.isResultSuccessful(result)) {
			this.errorMessage = 'invalid username or password';
			return;
		}

		this.processLoginResult(result);
	}

	async syncUpdatedData() {
		let data = await this.getUpdatedUserData();

		if (!data) {
			new UserStore(this.storageProvider).clear();
			return;
		}

		this.updateTaskData(data);
	}

	private async getUpdatedUserData() {
		let api = new API();
		let userStore = new UserStore(this.storageProvider);

		let result = await api.Sync(userStore.get().key);

		if (!this.isResultSuccessful(result)) return null;

		let data = result[0];
		return data;
	}

	private async fetchLogin(username: string, password: string) {
		let api = new API();

		let result = await api.Login(username, password);
		return result;
	}

	private processLoginResult(result: ApiData[]) {
		let data = result[0];

		this.updateUserData(data);
		this.updateTaskData(data);
	}

	private updateUserData(data: ApiData) {
		let userStore = new UserStore(this.storageProvider);
		userStore.add({ key: data.key });
	}

	private updateTaskData(data: ApiData) {
		let taskData = JSON.parse(data.task_data) as ApiPayloadV1_0_0;

		let taskStore = new TaskStore(this.storageProvider);

		taskStore.setTasks(taskData.tasks);
	}

	private isResultSuccessful(data: ApiData[]) {
		return data.length > 0;
	}
}
