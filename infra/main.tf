# ORGANIZE LATER (GROUP GET, SAVE, DELETE, POLICIES, ETC TOGETHER)

terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "us-west-2"
}

# Creates the dynamodb_table
resource "aws_dynamodb_table" "notes-table" {
    name = "lotion-30142889"
    billing_mode = "PROVISIONED"

    read_capacity = 1
    write_capacity = 1

    hash_key = "email"
    range_key = "id"

    attribute {
      name = "email"
      type = "S"
    }

    attribute {
        name = "id"
        type = "S"
    }
}

locals {
  function_deleter = "delete-note-30141055"
  function_getter = "get-notes-30141055"
  function_saver = "save-note-30141055"
  handler_name = "main.lambda_handler"
}
# Creates the bucket for lambda functions
resource "aws_s3_bucket" "lambda" {
    bucket = "lotion-function"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
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

# Zip delete function
data "archive_file" "delete-zip" {
  type = "zip"
  source_file = "../functions/delete-note/main.py"
  output_path = "delete-notes.zip"
}


data "archive_file" "get-zip" {
  type = "zip"
  source_file = "../functions/get-notes/main.py"
  output_path = "get-notes.zip"
}

data "archive_file" "save-zip" {
  type = "zip"
  source_file = "../functions/save-note/main.py"
  output_path = "save-notes.zip"
}

# Create lambda get function
resource"aws_lambda_function" "get-notes" {
  role = aws_iam_role.iam_for_lambda.arn # attaches role to lambda function
  function_name = local.function_getter
  handler = local.handler_name
  filename = "${path.module}/get-notes.zip"
  source_code_hash = data.archive_file.get-zip.output_base64sha256

  runtime = "python3.9"
}

# Create lambda delete function
resource "aws_lambda_function" "delete-notes" {
  role = aws_iam_role.iam_for_lambda.arn # attaches role to lambda function
  function_name = local.function_deleter
  handler = local.handler_name
  filename = "${path.module}/delete-notes.zip"
  source_code_hash = data.archive_file.delete-zip.output_base64sha256

  runtime = "python3.9"
}


# Create lambda save note function
resource "aws_lambda_function" "save-notes" {
  role = aws_iam_role.iam_for_lambda.arn # attaches role to lambda function
  function_name = local.function_saver
  handler = local.handler_name
  filename = "${path.module}/save-notes.zip"
  source_code_hash = data.archive_file.save-zip.output_base64sha256

  runtime = "python3.9"
}

# Create policy to allow logging and query
resource "aws_iam_policy" "policy" {
  name        = "policy-lotion"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:Query"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

# Adding policy to role
resource "aws_iam_role_policy_attachment" "lambda_policies" {
  role = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.policy.arn
}
# Create delete-notes function url
resource "aws_lambda_function_url" "delete-notes-url" {
  function_name = aws_lambda_function.delete-notes.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins = ["*"]
    allow_methods = ["DELETE"]
    allow_headers = ["*"]
    expose_headers = ["keep-alive", "date"]
  }
}

# Create get-notes function url
resource "aws_lambda_function_url" "get-notes-url" {
  function_name = aws_lambda_function.get-notes.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins = ["*"]
    allow_methods = ["GET"]
    allow_headers = ["*"]
    expose_headers = ["keep-alive", "date"]
  }
}

# Create save-notes function url
resource "aws_lambda_function_url" "save-notes-url" {
  function_name = aws_lambda_function.save-notes.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins = ["*"]
    allow_methods = ["POST"]
    allow_headers = ["*"]
    expose_headers = ["keep-alive", "date"]
  }
}

output "delete_url" {
  value = aws_lambda_function_url.delete-notes-url.function_url
}

output "get_url" {
  value = aws_lambda_function_url.get-notes-url.function_url
}

output "save_url" {
  value = aws_lambda_function_url.save-notes-url.function_url
}