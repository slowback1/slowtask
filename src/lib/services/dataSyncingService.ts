import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import UserPayloadGenerator from '$lib/utils/userPayloadGenerator';
import API from '$lib/api/api';

export default class DataSyncingService {
	private static hasInitialized: boolean = false;
	private static api: API;

	static initialize() {
		if (this.hasInitialized) return;

		this.api = new API();

		MessageBus.subscribe(Messages.TaskData, () => this.debounce());

		this.hasInitialized = true;
	}

	private static async syncUpdatedData() {
		let userData = MessageBus.getLastMessage(Messages.UserData);

		if (!userData) return;

		await this.sendSyncingRequest(userData);

		MessageBus.sendMessage(Messages.DataIsSyncing, false);
	}

	private static async sendSyncingRequest(userData: { key: string }) {
		let generator = new UserPayloadGenerator();
		let payload = generator.generatePayloadFromKey(userData.key);

		await this.api.UpdateUserTaskData(userData.key, payload);
	}

	private static timer: any;

	private static debounce() {
		let userData = MessageBus.getLastMessage(Messages.UserData);

		if (!userData) return;

		if (this.timer) clearTimeout(this.timer);

		MessageBus.sendMessage(Messages.DataIsSyncing, true);
		this.timer = setTimeout(() => {
			this.syncUpdatedData();
		}, 500);
	}
}
