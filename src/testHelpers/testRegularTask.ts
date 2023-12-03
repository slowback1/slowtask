import type { RegularTask } from '$lib/types';
import { RegularTaskScheduleType } from '$lib/types';

export const testRegularTask: RegularTask = {
	taskName: 'test',
	scheduleTypeModifier: 1,
	id: 'abcd',
	nextScheduledDate: new Date(),
	scheduleType: RegularTaskScheduleType.Daily
};