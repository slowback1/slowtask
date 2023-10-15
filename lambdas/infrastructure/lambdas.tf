resource "aws_iam_role" "iam_for_auth_tf" {
  name = "iam_for_auth_tf"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "auth_lambda" {
  function_name    = "auth_lambda"
  role             = aws_iam_role.iam_for_auth_tf.arn
  filename         = "auth_function.zip"
  handler          = "auth.handler"
  source_code_hash = data.archive_file.auth_zip.output_base64sha256
  runtime          = "nodejs14.x"
}