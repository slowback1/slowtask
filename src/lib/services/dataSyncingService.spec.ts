import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import { testTask } from '../../testHelpers/testTask';
import { beforeEach, type Mock } from 'vitest';
import DataSyncingService from '$lib/services/dataSyncingService';
import type { ApiPayloadV1_0_0 } from '$lib/types';
import { MockFetch } from '../../testHelpers/mockFetch';
import { waitFor } from '@testing-library/svelte';

describe('DataSyncingService', () => {
	let mockFetch: Mock;

	beforeEach(() => {
		MessageBus.clearAll();

		MessageBus.sendMessage(Messages.UserData, { key: 'value' });

		mockFetch = MockFetch({});
		DataSyncingService.initialize();
	});

	it('updates the stored data after receiving updated task data', async () => {
		triggerSync();

		await waitFor(
			() => {
				expect(mockFetch).toHaveBeenCalled();

				let [url, options] = mockFetch.mock.lastCall;

				expect(url).toContain(`?key=eq.value`);
				expect(options.method).toEqual('PATCH');

				let postBody = JSON.parse(options.body) as { task_data: ApiPayloadV1_0_0 };

				expect(postBody.task_data.key).toEqual('value');
				expect(postBody.task_data.tasks[0].taskId).toEqual(testTask.taskId);
			},
			{ timeout: 1000 }
		);
	});

	it('initializing twice does not subscribe to the message bus twice', async () => {
		DataSyncingService.initialize();

		mockFetch.mockClear();

		triggerSync();

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledOnce();
		});
	});

	it('sends a message that data is syncing while data is syncing', async () => {
		triggerSync();

		await waitFor(
			() => {
				expect(MessageBus.getLastMessage(Messages.DataIsSyncing)).toEqual(true);
			},
			{ timeout: 1000 }
		);
	});

	function triggerSync() {
		MessageBus.sendMessage(Messages.TaskData, [testTask]);
	}

	it('sends a message that data has synced once the  data is done syncing', async () => {
		triggerSync();

		await waitFor(
			() => {
				expect(MessageBus.getLastMessage(Messages.DataIsSyncing)).toEqual(true);
			},
			{ timeout: 1000 }
		);

		await waitFor(
			() => {
				expect(MessageBus.getLastMessage(Messages.DataIsSyncing)).toEqual(false);
			},
			{ timeout: 1000 }
		);
	});

	it('does not try to sync if the user is not logged in', async () => {
		mockFetch.mockClear();
		MessageBus.clear(Messages.UserData);
		triggerSync();

		await waitFor(() => {
			expect(MessageBus.getLastMessage(Messages.DataIsSyncing)).toEqual(null);
		});
	});

	it('debounces the updated sync data', async () => {
		mockFetch.mockClear();

		triggerSync();
		triggerSync();
		triggerSync();
		triggerSync();
		triggerSync();
		triggerSync();
		triggerSync();

		await waitFor(() => {
			expect(MessageBus.getLastMessage(Messages.DataIsSyncing)).toEqual(false);
		});

		expect(mockFetch).toHaveBeenCalledOnce();
	});
});
