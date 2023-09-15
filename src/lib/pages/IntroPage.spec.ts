import type { RenderResult } from '@testing-library/svelte';
import IntroPage from '$lib/pages/IntroPage.svelte';
import { beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';

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
		it('contains a new user section', () => {
			let section = result.getByTestId('intro-page__new-user');
			expect(section).toBeTruthy();
			expect(section.className).toEqual('intro-page__new-user');
		});

		it('contains a link to start the app as a new user', () => {
			let link = result.getByTestId('intro-page__new-user-button');
			expect(link).toBeTruthy();
			expect(link.getAttribute('href')).toEqual('/task');
		});
	});
});
