import type { PlayerData } from '$lib/types';
import { testUserExperience } from './testUserExperience';
import { testUserStats } from './testUserStats';

export const testPlayerData: PlayerData = {
	experience: testUserExperience,
	stats: testUserStats,
	name: 'Sir Testington'
};
