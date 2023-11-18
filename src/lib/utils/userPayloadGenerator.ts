import type { ApiPayloadV1_0_0, IApiPayload } from '$lib/types';
import UserEncoder from '$lib/api/userEncoder';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

export default class UserPayloadGenerator {
	constructor() {}

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
		let tasks = MessageBus.getLastMessage(Messages.TaskData) ?? [];
		let player = MessageBus.getLastMessage(Messages.PlayerData) ?? {};

		return {
			...payload,
			tasks,
			playerData: player
		};
	}

	generatePayloadFromKey(key: string): IApiPayload {
		return this.generateV1_0_0Payload({
			key: key,
			version: '1.0.0'
		});
	}
}
