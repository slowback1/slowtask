import type { RenderResult } from '@testing-library/svelte';
import Header from '$lib/components/header/Header.svelte';
import { afterEach, beforeEach } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import type IStorageProvider from '$lib/store/IStorageProvider';
import getLocalStorageMock from '../../../testHelpers/localStorageMock';
import { MockFetch } from '../../../testHelpers/mockFetch';
import { testApiData } from '../../../testHelpers/testApiData';
import { testTask } from '../../../testHelpers/testTask';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('Header', () => {
	let result: RenderResult<Header>;
	let storageProvider: IStorageProvider;

	afterEach(() => {
		MessageBus.clear(Messages.UserData);
	});

	function renderComponent() {
		if (result) result.unmount();

		result = render(Header);
	}

	beforeEach(() => {
		storageProvider = getLocalStorageMock();

		renderComponent();
	});

	it('renders the nav', () => {
		let nav = result.getByTestId('header');

		expect(nav).toBeInTheDocument();
	});

	it('contains a skip to content link', () => {
		let skipLink = result.getByTestId('header__skip-content-link');

		expect(skipLink).toHaveAttribute('href', '#content');
	});

	it('contains a link to home', () => {
		let link = result.getByTestId('header__home-link');

		expect(link).toHaveAttribute('href', '/');
	});

	describe('when the user is not logged in', () => {
		beforeEach(() => {
			MessageBus.clear(Messages.UserData);

			renderComponent();
		});

		it('contains a form to register a user', () => {
			let form = result.getByTestId('header__register-form');

			expect(form).toBeInTheDocument();
		});
	});

	describe('when the user is logged in', () => {
		beforeEach(() => {
			MessageBus.sendMessage(Messages.UserData, { key: 'abcd' });

			renderComponent();
		});

		it('does not contain a form to register a user', () => {
			expect(
				result.container.querySelector("[data-testid='header__register-form']")
			).not.toBeInTheDocument();
		});

		it('contains a button to refresh the user data', () => {
			let button = result.getByTestId('header__refresh-button');

			expect(button).toBeInTheDocument();
		});

		it('clicking the refresh button calls the api to refresh the user data', async () => {
			let button = result.getByTestId('header__refresh-button');

			let mockFetch = MockFetch([testApiData]);
			await fireEvent.click(button);

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalled();

				expect(MessageBus.getLastMessage(Messages.TaskData)).toEqual([testTask]);
			});
		});

		it('has a log out button', () => {
			let button = result.getByTestId('header__log-out-button');

			fireEvent.click(button);

			let lastUserValue = MessageBus.getLastMessage(Messages.UserData);

			expect(lastUserValue).toEqual(null);
		});
	});
});
