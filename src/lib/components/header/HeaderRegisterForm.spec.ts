import { beforeEach } from 'vitest';
import { fireEvent, render, type RenderResult, waitFor } from '@testing-library/svelte';
import { MockFetch } from '../../../testHelpers/mockFetch';
import type IStorageProvider from '$lib/store/IStorageProvider';
import HeaderRegisterForm from '$lib/components/header/HeaderRegisterForm.svelte';
import getLocalStorageMock from '../../../testHelpers/localStorageMock';

describe('when the user is not logged in', () => {
	let result: RenderResult<HeaderRegisterForm>;
	let storageProvider: IStorageProvider;

	function renderComponent() {
		if (result) result.unmount();

		result = render(HeaderRegisterForm);
	}

	beforeEach(() => {
		storageProvider = getLocalStorageMock();

		renderComponent();
	});

	it('contains a form to register a user', () => {
		let form = result.getByTestId('header__register-form');

		expect(form).toBeInTheDocument();
	});

	async function fillOutRegisterForm() {
		let usernameField = result.getByTestId('header__register-username');
		let passwordField = result.getByTestId('header__register-password');

		await fireEvent.change(usernameField, { target: { value: 'username' } });
		await fireEvent.change(passwordField, { target: { value: 'password' } });
	}

	it('Can register a user', async () => {
		await fillOutRegisterForm();

		let submitButton = result.getByTestId('header__register-submit');

		let mockFetch = MockFetch({});

		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalled();
		});
	});

	it('can submit the form via a form submit event', async () => {
		await fillOutRegisterForm();

		let form = result.getByTestId('header__register-submit');

		let mockFetch = MockFetch({});
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalled();
		});
	});
});
