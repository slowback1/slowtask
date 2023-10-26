import ApiParser from '$lib/api/apiParser';
import { testApiPayloadV1_0_0 } from '../../testHelpers/testApiPayloads';

describe('ApiParser', () => {
	let parser = new ApiParser();

	it('can build out the api request for a v1.0.0 structure of data', () => {
		let result = parser.buildApiRequest(testApiPayloadV1_0_0);

		expect(result.key).toEqual(testApiPayloadV1_0_0.key);
		expect(result.task_data).toEqual(JSON.stringify(testApiPayloadV1_0_0));
	});

	it('can build out the api response for a v1.0.0 structure of data', () => {
		let result = parser.buildApiResponse({
			key: testApiPayloadV1_0_0.key,
			task_data: JSON.stringify(testApiPayloadV1_0_0)
		});

		expect(result).toEqual(testApiPayloadV1_0_0);
	});
});
