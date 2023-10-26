import type { ApiData, ApiPayloadV1_0_0, IApiPayload } from '$lib/types';

export default class ApiParser {
	buildApiRequest(payload: IApiPayload): ApiData {
		return {
			key: payload.key,
			task_data: JSON.stringify(payload)
		};
	}

	buildApiResponse(payload: ApiData): IApiPayload {
		let data: IApiPayload = JSON.parse(payload.task_data);

		return this.mapV1_0_0Payload(data as ApiPayloadV1_0_0);
	}

	private mapV1_0_0Payload(payload: ApiPayloadV1_0_0): ApiPayloadV1_0_0 {
		payload.tasks = payload.tasks.map((t) => ({
			...t,
			createdDate: new Date(t.createdDate),
			dueDate: new Date(t.dueDate)
		}));

		return payload;
	}
}
