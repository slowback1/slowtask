import type { ApiPayloadV1_0_0 } from '$lib/types';
import { testTask } from './testTask';
import { testPlayerData } from './testPlayerData';

export const testApiPayloadV1_0_0: ApiPayloadV1_0_0 = {
	key: 'key',
	version: '1.0.0',
	tasks: [testTask],
	playerData: testPlayerData
};
