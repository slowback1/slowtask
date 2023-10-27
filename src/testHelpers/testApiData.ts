import type { ApiData } from '$lib/types';
import { testTask } from './testTask';
import { testApiPayloadV1_0_0 } from './testApiPayloads';

export const testApiData: ApiData = {
	created_at: '2023-10-24T12:55:31.165896+00:00',
	task_data: JSON.stringify(testApiPayloadV1_0_0),
	key: 'test'
};
