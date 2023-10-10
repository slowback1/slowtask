import type { RenderResult } from '@testing-library/svelte';
import Button from '$lib/components/buttons/Button.svelte';
import { beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';

describe('Button', () => {
	let result: RenderResult<Button>;

	function renderComponent(props: any = {}) {
		if (result) result.unmount();

		result = render(Button, { props });
	}

	beforeEach(() => {
		renderComponent();
	});

	it('renders a button', () => {
		let button = result.getByRole('button');

		expect(button).toBeInTheDocument();
	});

	it('clicking the button fires a click event', () => {
		let button = result.getByRole('button');

		let eventListener = vi.fn();

		button.addEventListener('click', eventListener);

		fireEvent.click(button);

		expect(eventListener).toHaveBeenCalled();
	});

	it("by default has a 'button-primary' class", () => {
		let button = result.getByRole('button');
		expect(button).toHaveClass('button-primary');
	});

	it("can pass in a 'secondary' variant to get a 'button-secondary' class", () => {
		renderComponent({ variant: 'secondary' });

		let button = result.getByRole('button');

		expect(button).toHaveClass('button-secondary');
	});

	it("does not have a 'button-primary' class when the variant is 'secondary'", () => {
		renderComponent({ variant: 'secondary' });

		let button = result.getByRole('button');

		expect(button).not.toHaveClass('button-primary');
	});

	it("does not have a 'button-secondary' class when the variant is 'primary'", () => {
		let button = result.getByRole('button');

		expect(button).not.toHaveClass('button-secondary');
	});

	it('passes through the test-id attribute', () => {
		let testId = 'test-button';

		renderComponent({ testId: testId });
		let buttonWithTestId = result.getByTestId(testId);

		expect(buttonWithTestId).toBeInTheDocument();
	});
});
