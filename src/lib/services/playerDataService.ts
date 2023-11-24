import MessageBus from '$lib/bus/MessageBus';
import type { PlayerData, PlayerStats } from '$lib/types';
import { Messages } from '$lib/bus/Messages';

export default class PlayerDataService {
	playerData: PlayerData;
	unsubscribe: () => void;

	constructor() {
		if (!this.isPlayerDefined()) this.initializePlayerData();

		this.unsubscribe = MessageBus.subscribe(
			Messages.PlayerData,
			(value) => (this.playerData = value)
		);
	}

	addExperience(experience: number) {
		let playerData = this.getPlayerData();

		playerData.experience.currentExperience += experience;

		if (playerData.experience.currentExperience >= 100) {
			this.processLevelUp(playerData);
		}

		this.saveChanges(playerData);
	}

	spendPoint(attribute: keyof PlayerStats) {
		let playerData = this.getPlayerData();

		if (playerData.experience.pointsToSpend <= 0) throw new Error('Player has no points to spend!');

		playerData.stats[attribute] += 1;
		playerData.experience.pointsToSpend -= 1;

		this.saveChanges(playerData);
	}

	setName(name: string) {
		let playerData = this.getPlayerData();

		playerData.name = name;

		this.saveChanges(playerData);
	}

	private processLevelUp(playerData: PlayerData) {
		playerData.experience.level += Math.floor(playerData.experience.currentExperience / 100);
		playerData.experience.pointsToSpend += Math.floor(
			playerData.experience.currentExperience / 100
		);
		playerData.experience.currentExperience = playerData.experience.currentExperience % 100;
	}

	private saveChanges(playerData: PlayerData) {
		MessageBus.sendMessage(Messages.PlayerData, playerData);
	}

	private initializePlayerData() {
		let playerData: PlayerData = {
			stats: {
				health: 10,
				attack: 1,
				searching: 1,
				healing: 1,
				defense: 1,
				gathering: 1
			},
			experience: {
				currentExperience: 0,
				level: 1,
				pointsToSpend: 0
			},
			name: 'Task Hero'
		};

		MessageBus.sendMessage(Messages.PlayerData, playerData);
	}

	private getPlayerData(): PlayerData {
		return MessageBus.getLastMessage(Messages.PlayerData);
	}

	private isPlayerDefined() {
		let maybeStoredPlayerData = this.getPlayerData();

		return (
			!!maybeStoredPlayerData && !!maybeStoredPlayerData.experience && !!maybeStoredPlayerData.stats
		);
	}
}
