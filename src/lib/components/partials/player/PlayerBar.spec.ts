import type { RenderResult } from '@testing-library/svelte';
import PlayerBar from '$lib/components/partials/player/PlayerBar.svelte';
import { render } from '@testing-library/svelte';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { testPlayerData } from '../../../../testHelpers/testPlayerData';
import { Messages } from '$lib/bus/Messages';

describe('PlayerBar', () => {
	let result: RenderResult<PlayerBar>;

	function renderComponent(props: any = {}) {
		if (result) result.unmount();

		result = render(PlayerBar);
	}

	beforeEach(() => {
		MessageBus.sendMessage(Messages.PlayerData, testPlayerData);

		renderComponent();
	});

	it('renders a menubar', () => {
		let menubar = result.getByRole('menubar');

		expect(menubar).toBeInTheDocument();
	});
	it('contains the player experience indicator', () => {
		let experienceIndicator = result.getByTestId('current-experience__announcer');

		expect(experienceIndicator).toBeInTheDocument();
	});
});
