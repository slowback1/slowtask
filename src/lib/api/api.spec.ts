import { afterEach, beforeEach, describe } from 'vitest';
import API from '$lib/api/api';
import { waitFor } from '@testing-library/svelte';
import { MockFetch } from '../../testHelpers/mockFetch';
import { testApiConfig } from '../../testHelpers/testApiConfig';
import type { ApiData } from '$lib/types';
import ApiParser from '$lib/api/apiParser';
import { testApiPayloadV1_0_0 } from '../../testHelpers/testApiPayloads';
import UserEncoder from '$lib/api/userEncoder';

describe('API', () => {
	afterEach(() => {
		API.api_config_promise = null;
	});

	describe('on constructing', () => {
		it('fetches the api config if it is not in memory yet', async () => {
			let mockFetch = MockFetch(testApiConfig);
			let api = new API();

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalled();

				const [url] = mockFetch.mock.lastCall;

				expect(url).toContain('api_config.json');
			});
		});

		it('does not fetch the api config twice if the api class is constructed twice', async () => {
			let mockFetch = MockFetch(testApiConfig);

			let api = new API();
			let api2 = new API();

			await new Promise((res) => setTimeout(() => res(1), 100));

			expect(mockFetch).toHaveBeenCalledOnce();
		});

		it('can provide the stored api config', async () => {
			let mockFetch = MockFetch(testApiConfig);
			let api = new API();

			let result = await api.getApiConfig();

			expect(result).toEqual(testApiConfig);
		});
	});

	describe('logging in', () => {
		let api: API;

		beforeEach(async () => {
			MockFetch(testApiConfig);

			api = new API();

			await API.api_config_promise;
		});

		let testSuccessfulResponse: ApiData[] = [new ApiParser().buildApiRequest(testApiPayloadV1_0_0)];
		let testFailureResponse: ApiData[] = [];

		function mockSuccessResponse() {
			return MockFetch(testSuccessfulResponse);
		}

		function mockFailingResponse() {
			return MockFetch(testFailureResponse);
		}

		it('calls the correct url when logging in', async () => {
			let mockFetch = mockSuccessResponse();

			await api.Login('username', 'password');

			let [url] = mockFetch.mock.lastCall;

			let mockBase64UserPass = new UserEncoder('username', 'password').encode();

			expect(url).toContain('?key=eq.' + mockBase64UserPass);
		});

		it('contains a bearer token for the api bearer token', async () => {
			let mockFetch = mockSuccessResponse();
			await api.Login('username', 'password');

			let [url, options] = mockFetch.mock.lastCall;

			let authHeader = options.headers.Authorization;

			expect(authHeader).toEqual(`Bearer ${testApiConfig.auth_token}`);
		});

		it('contains an api key header for the api key', async () => {
			let mockFetch = mockSuccessResponse();
			await api.Login('username', 'password');

			let [url, options] = mockFetch.mock.lastCall;

			let apiKey = options.headers.apikey;

			expect(apiKey).toEqual(testApiConfig.api_key);
		});
	});

	describe('syncing data', () => {
		let testSuccessfulResponse: ApiData[] = [new ApiParser().buildApiRequest(testApiPayloadV1_0_0)];
		let testFailureResponse: ApiData[] = [];

		let api: API;

		beforeEach(async () => {
			MockFetch(testApiConfig);

			api = new API();

			await API.api_config_promise;
		});

		function mockSuccessResponse() {
			return MockFetch(testSuccessfulResponse);
		}

		function mockFailingResponse() {
			return MockFetch(testFailureResponse);
		}

		it('calls the correct url', async () => {
			let mockFetch = mockSuccessResponse();

			let result = await api.Sync('test user key');

			let [url] = mockFetch.mock.lastCall;

			expect(url).toContain('?key=eq.test user key');
		});
	});

	describe('creating a user', () => {
		let api: API;

		beforeEach(async () => {
			MockFetch(testApiConfig);

			api = new API();

			await API.api_config_promise;
		});

		it('calls the correct url and method for creating the user', async () => {
			let mockFetch = MockFetch({});
			let result = await api.CreateUser('username', 'password', {});

			let [url, options] = mockFetch.mock.lastCall;

			expect(url).toEqual('test api url');

			expect(options.method).toEqual('POST');

			let encodedUser = new UserEncoder('username', 'password').encode();

			let decodedBody = JSON.parse(options.body);

			expect(decodedBody).toEqual({ key: encodedUser, task_data: {} });
		});

		it('has the correct content-type header', async () => {
			let mockFetch = MockFetch({});

			let result = await api.CreateUser('u', 'p', {});

			let [_, options] = mockFetch.mock.lastCall;

			let contentTypeHeader = options.headers['Content-Type'];

			expect(contentTypeHeader).toEqual('application/json');
		});
	});

	describe('updating data', () => {
		let api: API;

		beforeEach(async () => {
			MockFetch(testApiConfig);

			api = new API();

			await API.api_config_promise;
		});

		it('can update a row with updated task data', async () => {
			let mockFetch = MockFetch({});

			let result = await api.UpdateUserTaskData('key', { task_data: { task_data: 'value' } });

			let [url, options] = mockFetch.mock.lastCall;

			expect(url).toContain('?key=eq.key');

			expect(options.method).toEqual('PATCH');
			expect(options.body).toEqual(
				JSON.stringify({ task_data: { task_data: { task_data: 'value' } } })
			);
		});
	});
});
