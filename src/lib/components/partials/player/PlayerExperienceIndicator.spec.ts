import type { RenderResult } from '@testing-library/svelte';
import PlayerExperienceIndicator from '$lib/components/partials/player/PlayerExperienceIndicator.svelte';
import { act, render, waitFor } from '@testing-library/svelte';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import { testPlayerData } from '../../../../testHelpers/testPlayerData';

describe('PlayerExperienceIndicator', () => {
	let result: RenderResult<PlayerExperienceIndicator>;

	function renderComponent(props: any = {}) {
		if (result) result.unmount();

		result = render(PlayerExperienceIndicator, { props });
	}

	beforeEach(() => {
		MessageBus.sendMessage(Messages.PlayerData, testPlayerData);

		renderComponent();
	});

	it('renders a component with a meter role', () => {
		let meter = result.getByRole('meter');

		expect(meter).toBeInTheDocument();
	});

	it('the meter has the correct min and max values of 0 and 100', () => {
		let meter = result.getByRole('meter') as HTMLMeterElement;

		expect(meter.min).toEqual(0);
		expect(meter.max).toEqual(100);
	});

	it('the meter is correctly hooked up with a label', () => {
		let meter = result.getByRole('meter');
		let label = result.container.querySelector('label');

		expect(meter).toBeInTheDocument();
		expect(meter.id).toEqual('experience-bar');

		expect(label).toBeInTheDocument();
		expect(label.htmlFor).toEqual('experience-bar');
		expect(label).toHaveTextContent('Experience');
	});

	it('the meter has a current value and is described in both as a value and an aria-valuenow', async () => {
		MessageBus.sendMessage(Messages.PlayerData, testPlayerData);

		await waitFor(() => {
			let meter = result.getByRole('meter') as HTMLMeterElement;

			expect(meter.value).toEqual(testPlayerData.experience.currentExperience);
			expect(meter.getAttribute('aria-valuenow')).toEqual(
				`${testPlayerData.experience.currentExperience}`
			);
		});
	});
	it('contains an aria-live that politely announces the current experience value', async () => {
		await act(() => {
			MessageBus.sendMessage(Messages.PlayerData, testPlayerData);
		});

		await waitFor(() => {
			let live = result.getByTestId('current-experience__announcer');

			expect(live).toHaveAttribute('aria-live', 'polite');
			expect(live).toHaveTextContent('Current Player Experience: 55');
		});
	});

	it('contains a title that shows the current experience', async () => {
		await act(() => {
			MessageBus.sendMessage(Messages.PlayerData, testPlayerData);
		});

		await waitFor(() => {
			let meter = result.getByRole('meter') as HTMLMeterElement;

			expect(meter.getAttribute('title')).toEqual(
				`${testPlayerData.experience.currentExperience}exp`
			);
		});
	});
});
