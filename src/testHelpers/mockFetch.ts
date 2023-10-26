export function MockFetch(response: any) {
	let mockFetch = vi.fn((url, options) =>
		Promise.resolve({
			json: () => Promise.resolve(response)
		})
	);

	global.fetch = mockFetch as any;

	return mockFetch;
}
