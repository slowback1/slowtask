import type { RenderResult } from '@testing-library/svelte';
import LevelUpModal from '$lib/components/partials/player/LevelUpModal.svelte';
import { beforeEach } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import MessageBus from '$lib/bus/MessageBus';
import PlayerDataService from '$lib/services/playerDataService';
import type { PlayerData, PlayerStats } from '$lib/types';
import { Messages } from '$lib/bus/Messages';

describe('LevelUpModal', () => {
	let result: RenderResult<LevelUpModal>;

	function renderComponent(props = {}) {
		if (result) result.unmount();

		result = render(LevelUpModal, { props });
	}

	beforeEach(() => {
		renderComponent();
	});

	it('contains a dialog that is closed by default', () => {
		let dialog = result.container.querySelector('dialog') as HTMLDialogElement;

		expect(dialog).toBeInTheDocument();
		expect(dialog.open).toBeFalsy();
	});

	async function openDialog() {
		let service = new PlayerDataService();
		service.addExperience(100);

		await waitFor(() => {
			let dialog = result.container.querySelector('dialog');

			expect(dialog.open).toBeTruthy();
		});
	}

	it('the dialog is opened when the player levels up', async () => {
		await openDialog();
	});

	const stats = ['health', 'attack', 'searching', 'healing', 'defense', 'gathering'];

	it.each(stats)('the dialog has a button to increase the %s stat', async (stat) => {
		await openDialog();

		let button = result.getByTestId('level-up__raise-' + stat);

		expect(button).toBeInTheDocument();
	});

	it.each(stats)('can increase the %s stat by 1 when clicking on the button', async (stat) => {
		await openDialog();

		let playerStatsBefore = MessageBus.getLastMessage<PlayerData>(Messages.PlayerData).stats[stat];

		let button = result.getByTestId(`level-up__raise-${stat}`);

		await fireEvent.click(button);

		let playerStatsAfter = MessageBus.getLastMessage<PlayerData>(Messages.PlayerData).stats[stat];

		let difference = playerStatsAfter - playerStatsBefore;

		expect(difference).toEqual(1);
	});

	it('closes the dialog when raising a stat', async () => {
		await openDialog();

		let button = result.getByTestId('level-up__raise-health');

		await fireEvent.click(button);

		await waitFor(() => {
			let dialog = result.container.querySelector('dialog');

			expect(dialog.open).toEqual(false);
		});
	});

	it('can close the dialog by clicking the close button', async () => {
		await openDialog();

		let closeButton = result.getByTestId('level-up__close');

		await fireEvent.click(closeButton);

		await waitFor(() => {
			let dialog = result.container.querySelector('dialog');

			expect(dialog.open).toEqual(false);
		});
	});
});
