import { beforeEach, expect, type Mock, vi } from 'vitest';
import { MockFetch } from '../../testHelpers/mockFetch';
import { testApiData } from '../../testHelpers/testApiData';
import LoginService from '$lib/services/loginService';
import type IStorageProvider from '$lib/store/IStorageProvider';
import getLocalStorageMock from '../../testHelpers/localStorageMock';
import UserStore from '$lib/store/userStore';
import TaskStore from '$lib/store/taskStore';
import { testTask } from '../../testHelpers/testTask';

describe('Login Service', () => {
	let mockFetch: Mock;
	let storageProvider: IStorageProvider;
	let loginService: LoginService;

	beforeEach(() => {
		mockFetch = MockFetch([testApiData]);
		storageProvider = getLocalStorageMock();

		loginService = new LoginService(storageProvider);
	});

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
