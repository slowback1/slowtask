import { beforeEach, expect, type Mock, vi } from 'vitest';
import { MockFetch } from '../../testHelpers/mockFetch';
import { testApiData } from '../../testHelpers/testApiData';
import LoginService from '$lib/services/loginService';
import type IStorageProvider from '$lib/store/IStorageProvider';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import UserStore from '$lib/store/userStore';
import TaskStore from '$lib/store/taskStore';
import { testTask } from '../../testHelpers/testTask';
import { testApiPayloadV1_0_0 } from '../../testHelpers/testApiPayloads';

describe('Login Service', () => {
	let mockFetch: Mock;
	let storageProvider: IStorageProvider;
	let loginService: LoginService;

	beforeEach(() => {
		mockFetch = MockFetch([testApiData]);
		storageProvider = getLocalStorageMock();

		loginService = new LoginService(storageProvider);
	});

	describe('Logging in', () => {
		it('calls the api when logging in', async () => {
			let result = await loginService.logIn('username', 'password');

			expect(mockFetch).toHaveBeenCalled();
		});

		it('updates the user store when logging in with a valid user/pass', async () => {
			let result = await loginService.logIn('username', 'password');

			let storedUser = new UserStore(storageProvider).get();

			expect(storedUser.key).toEqual(testApiData.key);
		});

		it('updates the task store when logging in with a valid user/pass', async () => {
			let result = await loginService.logIn('username', 'password');

			let storedTasks = new TaskStore(storageProvider).get();

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

			let storedUser = new UserStore(storageProvider).get();

			expect(storedUser).toBeDefined();
		});
	});

	describe('grabbing updated user data', () => {
		beforeEach(() => {
			new UserStore(storageProvider).add({ key: 'test key' });
			mockFetch = MockFetch([testApiData]);
		});

		it('calls the api when grabbing updated data', async () => {
			await loginService.syncUpdatedData();

			expect(mockFetch).toHaveBeenCalled();
		});

		it('updates the task data after syncing', async () => {
			await loginService.syncUpdatedData();

			let taskStore = new TaskStore(storageProvider);

			expect(taskStore.get()).toEqual(testApiPayloadV1_0_0.tasks);
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

				let user = new UserStore(storageProvider).get();

				expect(user).toBeUndefined();
			});
		});
	});
});
