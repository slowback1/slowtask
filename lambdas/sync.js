const AWS = require('aws-sdk');

exports.handler = async (event) => {
	const body = JSON.parse(event.body);

	const { id, key, payload } = body;

	const documentClient = new AWS.DynamoDB.DocumentClient();

	const params = {
		TableName: 'TaskStore',
		Item: {
			id: id,
			key: key,
			payload: payload
		}
	};

	let responseBody = '';
	let statusCode = 200;

	try {
		const data = await documentClient.put(params).promise();

		responseBody = JSON.stringify(data);
		statusCode = 201;
	} catch (err) {
		responseBody = `Unable to put task: ${err}`;
		statusCode = 403;
	}

	const response = {
		statusCode: statusCode,
		headers: {
			'Content-Type': 'application/json'
		},
		body: responseBody
	};

	return response;
};
