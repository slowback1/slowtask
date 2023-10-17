const AWS = require('aws-sdk');

exports.handler = async (event) => {
	const body = JSON.parse(event.body);

	const { key } = body;

	const documentClient = new AWS.DynamoDB.DocumentClient();

	const params = {
		TableName: 'TaskStore',
		Item: {
			key: key
		}
	};

	let responseBody = '';
	let statusCode = 200;

	try {
		const data = await documentClient.scan(params).promise();

		responseBody = JSON.stringify(data);
		statusCode = 201;
	} catch (err) {
		responseBody = `Unable to get task: ${err}`;
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
