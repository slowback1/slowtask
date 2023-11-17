import PlayerDataService from '$lib/services/playerDataService';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import type { PlayerData, PlayerStats } from '$lib/types';
import { testPlayerData } from '../../testHelpers/testPlayerData';

describe('PlayerDataService', () => {
	let instance: PlayerDataService;

	beforeEach(() => {
		MessageBus.clear(Messages.PlayerData);
		instance = new PlayerDataService();
	});

	it('can initialize the player data if it is not already there', () => {
		let playerData = getPlayerData();

		expect(playerData).toBeDefined();
		expect(playerData).not.toBeNull();
	});

	function getPlayerData() {
		return MessageBus.getLastMessage<PlayerData>(Messages.PlayerData);
	}

	it.each([
		['health', 10],
		['attack', 1],
		['searching', 1],
		['healing', 1],
		['defense', 1],
		['gathering', 1]
	])('has the correct default stat for %s', (stat, defaultValue) => {
		let playerData = getPlayerData();

		expect(playerData.stats[stat]).toEqual(defaultValue);
	});

	it.each([
		['level', 1],
		['currentExperience', 0],
		['pointsToSpend', 0]
	])('has the correct default experience value for %s', (key, defaultValue) => {
		let playerData = getPlayerData();

		expect(playerData.experience[key]).toEqual(defaultValue);
	});

	it('has the correct default name', () => {
		let playerData = getPlayerData();

		expect(playerData.name).toEqual('Task Hero');
	});

	it('does not overwrite the player data when it is already present', () => {
		MessageBus.sendMessage(Messages.PlayerData, testPlayerData);

		instance = new PlayerDataService();

		let playerData = getPlayerData();

		expect(playerData).toEqual(testPlayerData);
	});

	it('can add experience to the player', () => {
		instance.addExperience(5);

		let playerData = getPlayerData();

		expect(playerData.experience.currentExperience).toEqual(5);
	});

	it.each([[100], [50, 50], [25, 70, 90]])(
		'adding experience until the user reaches 100 points levels them up',
		(...experiencePointsToAdd) => {
			for (let experiencePointToAdd of experiencePointsToAdd)
				instance.addExperience(experiencePointToAdd);

			let playerData = getPlayerData();

			expect(playerData.experience.level).toEqual(2);
		}
	);

	it.each([
		[100, 0],
		[110, 10]
	])('leveling up resets the current experience count', (experienceGiven, expectedLeftover) => {
		instance.addExperience(experienceGiven);

		let playerData = getPlayerData();

		expect(playerData.experience.currentExperience).toEqual(expectedLeftover);
	});

	it('levels up twice when given 200 experience points', () => {
		instance.addExperience(200);

		let playerData = getPlayerData();

		expect(playerData.experience.level).toEqual(3);
	});

	it('leveling up gives the player a point to spend', () => {
		instance.addExperience(100);

		let playerData = getPlayerData();

		expect(playerData.experience.pointsToSpend).toEqual(1);
	});

	it('leveling up twice gives the player two points to spend', () => {
		instance.addExperience(200);

		let playerData = getPlayerData();

		expect(playerData.experience.pointsToSpend).toEqual(2);
	});

	it.each(['health', 'attack', 'searching', 'healing', 'defense', 'gathering'])(
		'can spend a point  to upgrade %s',
		(attribute: keyof PlayerStats) => {
			let beforeValue = getPlayerData().stats[attribute] as number;

			instance.addExperience(100);

			instance.spendPoint(attribute);

			let playerData = getPlayerData();

			expect(playerData.stats[attribute]).toEqual(beforeValue + 1);
		}
	);

	it('throws an error when trying to spend a point when there are no points to spend', () => {
		expect(() => {
			instance.spendPoint('health');
		}).throws();
	});

	it("deducts a point from the player's pool when they spend a point", () => {
		instance.addExperience(100);
		instance.spendPoint('health');

		let playerData = getPlayerData();

		expect(playerData.experience.pointsToSpend).toEqual(0);
	});

	it("can set the player's name", () => {
		instance.setName('Rathian');

		let playerData = getPlayerData();

		expect(playerData.name).toEqual('Rathian');
	});
});
