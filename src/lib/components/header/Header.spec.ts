import type { RenderResult } from '@testing-library/svelte';
import Header from '$lib/components/header/Header.svelte';
import { beforeEach } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import type IStorageProvider from '$lib/store/IStorageProvider';
import getLocalStorageMock from '../../../testHelpers/localStorageMock';
import STORAGE_KEYS from '$lib/store/storageKeys';
import UserStore from '$lib/store/userStore';
import { MockFetch } from '../../../testHelpers/mockFetch';
import { testApiData } from '../../../testHelpers/testApiData';
import TaskStore from '$lib/store/taskStore';
import { testTask } from '../../../testHelpers/testTask';

describe('Header', () => {
	let result: RenderResult<Header>;
	let storageProvider: IStorageProvider;

	function renderComponent() {
		if (result) result.unmount();

		result = render(Header, { props: { storageProvider: storageProvider } });
	}

	beforeEach(() => {
		storageProvider = getLocalStorageMock();

		renderComponent();
	});

	it('renders the nav', () => {
		let nav = result.getByTestId('header');

		expect(nav).toBeInTheDocument();
	});

	it('contains a link to home', () => {
		let link = result.getByTestId('header__home-link');

		expect(link).toHaveAttribute('href', '/');
	});

	describe('when the user is not logged in', () => {
		beforeEach(() => {
			storageProvider.setItem(STORAGE_KEYS.USER, '');
			renderComponent();
		});

		it('contains a form to register a user', () => {
			let form = result.getByTestId('header__register-form');

			expect(form).toBeInTheDocument();
		});
	});

	describe('when the user is logged in', () => {
		beforeEach(() => {
			new UserStore(storageProvider).add({ key: 'user' });
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
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalled();

				let taskStore = new TaskStore(storageProvider);
				expect(taskStore.get()).toEqual([testTask]);
			});
		});
	});
});
