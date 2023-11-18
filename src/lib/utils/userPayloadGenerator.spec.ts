import type IStorageProvider from '$lib/store/IStorageProvider';
import { beforeEach, expect } from 'vitest';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import UserPayloadGenerator from '$lib/utils/userPayloadGenerator';
import UserEncoder from '$lib/api/userEncoder';
import { testTask } from '../../testHelpers/testTask';
import type { ApiPayloadV1_0_0, Task } from '$lib/types';
import TaskService from '$lib/services/taskService';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import { testPlayerData } from '../../testHelpers/testPlayerData';

describe('UserPayloadGenerator', () => {
	let generator: UserPayloadGenerator;

	beforeEach(() => {
		generator = new UserPayloadGenerator();
	});

	it('can generate a payload when there are no task data', () => {
		let data = generator.generatePayload('username', 'password');

		expect(data.key).toEqual(new UserEncoder('username', 'password').encode());
		expect(data.version).toBeDefined();
	});

	it('the version is the latest version', () => {
		let data = generator.generatePayload('u', 'p');

		expect(data.version).toEqual('1.0.0');
	});

	function addTestTaskToStore() {
		let taskService = new TaskService();

		taskService.add(testTask);
	}

	it('appends the task data for a v1.0.0 payload', () => {
		addTestTaskToStore();

		let data = generator.generatePayload('u', 'p') as ApiPayloadV1_0_0;

		let storedTasks = MessageBus.getLastMessage<Task[]>(Messages.TaskData);

		expect(data.tasks).toEqual(storedTasks);
	});

	it('appends the player data for a v1.0.0 payload', () => {
		MessageBus.sendMessage(Messages.PlayerData, testPlayerData);

		let data = generator.generatePayload('u', 'p') as ApiPayloadV1_0_0;

		expect(data.playerData).toEqual(testPlayerData);
	});

	it('can generate a payload with an already-encrypted key', () => {
		addTestTaskToStore();

		let data = generator.generatePayloadFromKey('key') as ApiPayloadV1_0_0;

		let storedTasks = MessageBus.getLastMessage<Task[]>(Messages.TaskData);

		expect(data.tasks).toEqual(storedTasks);
	});
});
