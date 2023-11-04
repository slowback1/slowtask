import type { RenderResult } from '@testing-library/svelte';
import LoginForm from '$lib/components/partials/forms/LoginForm.svelte';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeEach } from 'vitest';
import { MockFetch } from '../../../../testHelpers/mockFetch';
import { testApiData } from '../../../../testHelpers/testApiData';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('Login Form', () => {
	let result: RenderResult<LoginForm>;

	function renderComponent() {
		if (result) result.unmount();

		result = render(LoginForm);
	}

	beforeEach(() => {
		renderComponent();
	});

	it('contains a form element', () => {
		let form = result.getByTestId('login-form');

		expect(form).toBeInTheDocument();
	});

	it.each([
		['username', 'Username'],
		['password', 'Password']
	])('has a %s field with a label %s', (testId, labelText) => {
		let field = result.getByTestId(`login-form__${testId}`);

		expect(field).toBeInTheDocument();

		let label = result.getByTestId(`login-form__${testId}-label`);
		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent(labelText);
	});

	it('the password field is of password type', () => {
		let field = result.getByTestId('login-form__password');

		expect(field).toHaveAttribute('type', 'password');
	});

	it('contains a submit button', () => {
		let button = result.getByTestId('login-form__submit');

		expect(button).toBeInTheDocument();
	});

	it('the submit button was initially disabled', () => {
		let button = result.getByTestId('login-form__submit');

		expect(button).toBeDisabled();
	});

	async function fillOutUsernameAndPasswordFields() {
		let username = result.getByTestId('login-form__username');
		await act(() => {
			fireEvent.input(username, { target: { value: 'username' } });
		});
		expect(username).toHaveValue('username');

		let password = result.getByTestId('login-form__password');
		await act(() => {
			fireEvent.input(password, { target: { value: 'password' } });
		});
		expect(password).toHaveValue('password');
	}

	it('the submit button is enabled once the username and password is filled out', async () => {
		await fillOutUsernameAndPasswordFields();

		await waitFor(() => {
			let button = result.getByTestId('login-form__submit');
			expect(button).not.toBeDisabled();
		});
	});

	async function submitFormWithButtonClick() {
		let button = result.getByTestId('login-form__submit');
		await fireEvent.click(button);
	}

	async function submitFormWithFormSubmit() {
		let form = result.getByTestId('login-form');
		await fireEvent.submit(form);
	}

	it.each(['click', 'submit'])(
		'going through the login workflow calls the API to log in',
		async (eventType) => {
			await fillOutUsernameAndPasswordFields();

			let mockFetch = MockFetch([testApiData]);

			if (eventType === 'click') {
				await submitFormWithButtonClick();
			}

			if (eventType === 'submit') {
				await submitFormWithFormSubmit();
			}

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalled();
			});
		}
	);

	it('the message bus eventually gets called with the updated user data after going through the login workflow', async () => {
		await fillOutUsernameAndPasswordFields();
		await submitFormWithFormSubmit();

		await waitFor(() => {
			let userData = MessageBus.getLastMessage(Messages.UserData);

			expect(userData).toBeDefined();
		});
	});

	it('does not display an error message by default', () => {
		let errorMessage = result.container.querySelector("[data-testid='login-form__error']");
		expect(errorMessage).not.toBeInTheDocument();
	});

	it('displays an error message when the api returns a non-successful response', async () => {
		await fillOutUsernameAndPasswordFields();
		MockFetch([]);
		await submitFormWithFormSubmit();

		await waitFor(() => {
			let errorMessage = result.getByTestId('login-form__error');

			expect(errorMessage).toBeDefined();

			expect(errorMessage).toHaveTextContent('invalid username or password');
		});
	});
});
