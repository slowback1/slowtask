import type IStorageProvider from '$lib/store/IStorageProvider';
import type { ApiPayloadV1_0_0, IApiPayload } from '$lib/types';
import UserEncoder from '$lib/api/userEncoder';
import TaskStore from '$lib/store/taskStore';

export default class UserPayloadGenerator {
	constructor(private storageProvder: IStorageProvider) {}

	generatePayload(username: string, password: string): IApiPayload {
		let key = this.getUserKey(username, password);

		return this.generateV1_0_0Payload({
			key,
			version: '1.0.0'
		});
	}

	private getUserKey(username: string, password: string) {
		return new UserEncoder(username, password).encode();
	}

	private generateV1_0_0Payload(payload: IApiPayload): ApiPayloadV1_0_0 {
		let tasks = new TaskStore(this.storageProvder).get();

		return {
			...payload,
			tasks
		};
	}
}
