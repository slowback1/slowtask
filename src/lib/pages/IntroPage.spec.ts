import type { RenderResult } from '@testing-library/svelte';
import IntroPage from '$lib/pages/IntroPage.svelte';
import { beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('IntroPage', () => {
	let result: RenderResult<IntroPage>;

	beforeEach(() => {
		result = render(IntroPage);
	});

	it('renders a page wrapper', () => {
		let wrapper = result.getByTestId('intro-page');

		expect(wrapper).toBeTruthy();
		expect(wrapper.className).toContain('intro-page');
	});

	describe('the new user section', () => {
		it('contains a link to start the app as a new user', () => {
			let link = result.getByTestId('intro-page__new-user-link');
			expect(link).toBeTruthy();
			expect(link.getAttribute('href')).toEqual('/task');
		});
	});

	describe('the login form', () => {
		it('contains a login form', () => {
			let form = result.getByTestId('login-form');

			expect(form).toBeInTheDocument();
		});
	});
});
