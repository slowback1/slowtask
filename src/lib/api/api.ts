import type { ApiConfig } from '$lib/types';
import UserEncoder from '$lib/api/userEncoder';

export default class API {
	static api_config_promise: Promise<ApiConfig>;

	constructor() {
		this.fetchApiConfig();
	}

	private async fetchApiConfig() {
		if (!API.api_config_promise)
			API.api_config_promise = fetch('/api_config.json').then((res) => res.json());
	}

	public async getApiConfig() {
		return await API.api_config_promise;
	}

	private async Request(urlSuffix: string, body: Partial<RequestInit> = {}) {
		let config = await this.getApiConfig();

		return fetch(`${config.api_url}${urlSuffix}`, {
			...body,
			headers: {
				Authorization: `Bearer ${config.auth_token}`,
				apikey: config.api_key
			}
		});
	}

	public async Login(username: string, password: string) {
		let encodedUser = new UserEncoder(username, password).encode();

		let url = `?key=eq.${encodedUser}`;

		return this.Request(url);
	}

	public async Sync(key: string) {
		let url = `?key=eq.${key}`;

		return this.Request(url);
	}

	public async CreateUser(username: string, password: string, body: object) {
		let url = '';

		let key = new UserEncoder(username, password).encode();

		let requestBody: Partial<RequestInit> = {
			method: 'POST',
			body: JSON.stringify({
				key,
				task_data: body
			})
		};

		return this.Request(url, requestBody);
	}
}
