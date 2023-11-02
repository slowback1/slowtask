import API from '$lib/api/api';
import type { ApiData, ApiPayloadV1_0_0 } from '$lib/types';
import UserPayloadGenerator from '$lib/services/userPayloadGenerator';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

export default class LoginService {
	constructor() {}

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
			MessageBus.clear(Messages.UserData);
			return;
		}

		this.updateTaskData(data);
	}

	async register(username: string, password: string) {
		let api = new API();

		let payload = new UserPayloadGenerator().generatePayload(username, password);

		await api.CreateUser(username, password, payload);

		await this.logIn(username, password);
	}

	private async getUpdatedUserData() {
		let api = new API();

		let currentUser = MessageBus.getLastMessage(Messages.UserData);

		let result = await api.Sync(currentUser.key);

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
		MessageBus.sendMessage(Messages.UserData, { key: data.key });
	}

	private updateTaskData(data: ApiData) {
		let taskData = data.task_data as ApiPayloadV1_0_0;

		MessageBus.sendMessage(Messages.TaskData, taskData.tasks);
	}

	private isResultSuccessful(data: ApiData[]) {
		return data.length > 0;
	}
}
