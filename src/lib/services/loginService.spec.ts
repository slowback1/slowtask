import { beforeAll, beforeEach, expect, type Mock, vi } from 'vitest';
import { MockFetch } from '../../testHelpers/mockFetch';
import { testApiData } from '../../testHelpers/testApiData';
import LoginService from '$lib/services/loginService';
import { testTask } from '../../testHelpers/testTask';
import { testApiPayloadV1_0_0 } from '../../testHelpers/testApiPayloads';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import type { Task, UserStoreType } from '$lib/types';

describe('Login Service', () => {
	let mockFetch: Mock;
	let loginService: LoginService;
	let currentUserData: UserStoreType;
	let currentTaskData: Task[] = [];

	beforeAll(() => {
		MessageBus.subscribe(Messages.UserData, (value) => (currentUserData = value));
		MessageBus.subscribe(Messages.TaskData, (value) => (currentTaskData = value ?? []));
	});

	beforeEach(() => {
		mockFetch = MockFetch([testApiData]);

		loginService = new LoginService();
	});

	describe('Logging in', () => {
		it('calls the api when logging in', async () => {
			let result = await loginService.logIn('username', 'password');

			expect(mockFetch).toHaveBeenCalled();
		});

		it('updates the user store when logging in with a valid user/pass', async () => {
			let result = await loginService.logIn('username', 'password');

			expect(currentUserData.key).toEqual(testApiData.key);
		});

		it('updates the task store when logging in with a valid user/pass', async () => {
			let result = await loginService.logIn('username', 'password');

			let storedTasks = currentTaskData;

			expect(storedTasks.length).toEqual(1);
			expect(storedTasks[0]).toEqual(testTask);
		});

		describe('when the login fails', () => {
			beforeEach(() => {
				MockFetch([]);
			});

			it('does not break', async () => {
				let result = await loginService.logIn('username', 'password');

				expect(true).toEqual(true);
			});

			it('sets the error message in the service', async () => {
				let result = await loginService.logIn('username', 'password');

				expect(loginService.errorMessage).toEqual('invalid username or password');
			});
		});
	});

	describe('Logging out', () => {
		beforeEach(async () => {
			await loginService.logIn('test', 'password');
		});

		it('can log the user out', () => {
			loginService.logOut();

			let userData = MessageBus.getLastMessage(Messages.UserData);

			expect(userData).toEqual(null);
		});

		it('logging the user out clears out all data', () => {
			MessageBus.sendMessage('something', 'value');

			loginService.logOut();

			let lastValue = MessageBus.getLastMessage('something');

			expect(lastValue).toEqual(null);
		});

		it('logging the user out redirects to home', () => {
			loginService.logOut();

			expect(window.location.href).toEqual('http://localhost:3000/');
		});
	});

	describe('registering a user', () => {
		beforeEach(() => {
			mockFetch = MockFetch([testApiData]);
		});

		it('can register a user', async () => {
			let result = await loginService.register('username', 'password');

			expect(mockFetch).toHaveBeenCalled();
		});

		it('after registering the user logs the user in automatically', async () => {
			let result = await loginService.register('username', 'password');

			expect(currentUserData.key).toEqual(testApiData.key);
		});
	});

	describe('grabbing updated user data', () => {
		beforeEach(() => {
			MessageBus.sendMessage(Messages.UserData, { key: 'test key' });
			mockFetch = MockFetch([testApiData]);
		});

		it('calls the api when grabbing updated data', async () => {
			await loginService.syncUpdatedData();

			expect(mockFetch).toHaveBeenCalled();
		});

		it('updates the task data after syncing', async () => {
			await loginService.syncUpdatedData();

			expect(currentTaskData).toEqual(testApiPayloadV1_0_0.tasks);
		});

		it('updates the message bus indicating that the data has been synced', async () => {
			await loginService.syncUpdatedData();

			expect(MessageBus.getLastMessage(Messages.DataIsSyncing)).toEqual(false);
		});

		describe("when the user doesn't exist", () => {
			beforeEach(() => {
				MockFetch([]);
			});

			it("doesn't break", async () => {
				await loginService.syncUpdatedData();

				expect(true).toEqual(true);
			});

			it('clears the user data', async () => {
				await loginService.syncUpdatedData();

				let user = currentUserData;

				expect(user).toBeNull();
			});
		});
	});
});
