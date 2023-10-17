resource "aws_api_gateway_rest_api" "lambda_api" {
  name = "slowtask_api"
}

resource "aws_api_gateway_resource" "sync" {
  rest_api_id = aws_api_gateway_rest_api.lambda_api.id
  parent_id   = aws_api_gateway_rest_api.lambda_api.root_resource_id
  path_part   = "sync"
}

resource "aws_api_gateway_method" "sync" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.sync.id
  rest_api_id   = aws_api_gateway_rest_api.lambda_api.id
}

resource "aws_api_gateway_integration" "sync" {
  http_method = aws_api_gateway_method.sync.http_method
  resource_id = aws_api_gateway_resource.sync.id
  rest_api_id = aws_api_gateway_rest_api.lambda_api.id
  type        = "AWS_PROXY"
  uri         = aws_lambda_function.sync_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "apideploy" {
  depends_on = [aws_api_gateway_integration.sync]

  rest_api_id = aws_api_gateway_rest_api.lambda_api.id
  stage_name  = "Prod"
}

resource "aws_lambda_permission" "apigw" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sync_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  statement_id  = "AllowExecutionFromAPIGateway"
  source_arn    = "${aws_api_gateway_rest_api.lambda_api.execution_arn}/Prod/POST/sync"
}

output "base_url" {
  value = aws_api_gateway_deployment.apideploy.invoke_url
}