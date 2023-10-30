import type IStorageProvider from '$lib/store/IStorageProvider';
import { beforeEach, expect } from 'vitest';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import UserPayloadGenerator from '$lib/services/userPayloadGenerator';
import UserEncoder from '$lib/api/userEncoder';
import TaskStore from '$lib/store/taskStore';
import { testTask } from '../../testHelpers/testTask';
import type { ApiPayloadV1_0_0 } from '$lib/types';

describe('UserPayloadGenerator', () => {
	let storageProvider: IStorageProvider;
	let generator: UserPayloadGenerator;

	beforeEach(() => {
		storageProvider = getLocalStorageMock();

		generator = new UserPayloadGenerator(storageProvider);
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
		new TaskStore(storageProvider).add(testTask);
	}

	it('appends the task data for a v1.0.0 payload', () => {
		addTestTaskToStore();

		let data = generator.generatePayload('u', 'p') as ApiPayloadV1_0_0;

		let storedTasks = new TaskStore(storageProvider).get();

		expect(data.tasks).toEqual(storedTasks);
	});
});
