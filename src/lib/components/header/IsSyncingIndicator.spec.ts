import type { RenderResult } from '@testing-library/svelte';
import IsSyncingIndicator from '$lib/components/header/IsSyncingIndicator.svelte';
import { act, render } from '@testing-library/svelte';
import { beforeEach, expect } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('IsSyncingIndicator', () => {
	let result: RenderResult<IsSyncingIndicator>;

	function renderComponent() {
		if (result) result.unmount();

		result = render(IsSyncingIndicator);
	}

	beforeEach(() => {
		renderComponent();
	});

	it('renders the indicator', () => {
		let indicator = result.getByTestId('is-syncing-indicator');

		expect(indicator).toBeInTheDocument();
	});

	it('indicates that it is syncing when the message bus has a message saying that it is', () => {
		act(() => {
			MessageBus.sendMessage(Messages.DataIsSyncing, true);
		});

		renderComponent();

		let indicator = result.getByTestId('is-syncing-indicator');

		expect(indicator).toHaveAttribute('data-is-syncing', 'true');
	});

	it('indicates that it is not syncing when the message has a message saying that it is not', () => {
		MessageBus.sendMessage(Messages.DataIsSyncing, false);

		renderComponent();

		let indicator = result.getByTestId('is-syncing-indicator');

		expect(indicator).toHaveAttribute('data-is-syncing', 'false');
	});
});
