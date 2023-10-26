export default class UserEncoder {
	constructor(private username: string, private password: string) {}

	encode(): string {
		return btoa(this.buildDecodedString());
	}

	private buildDecodedString() {
		return `${this.username}_${this.password}`;
	}
}
