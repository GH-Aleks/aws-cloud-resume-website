variable "environment" {
  description = "Umgebung (dev, stg, prod)"
  type        = string
}

variable "function_name" {
  description = "Name der Lambda-Funktion"
  type        = string
}

variable "table_name" {
  description = "Name der DynamoDB-Tabelle"
  type        = string
}

resource "aws_lambda_function" "feedback_api" {
  function_name = var.function_name
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_role.arn
  
  filename         = "${path.module}/function.zip"
  source_code_hash = filebase64sha256("${path.module}/function.zip")
  
  environment {
    variables = {
      ENV = var.environment
      FEEDBACK_TABLE = var.table_name
    }
  }
}

resource "aws_lambda_function_url" "feedback_api_url" {
  function_name      = aws_lambda_function.feedback_api.function_name
  authorization_type = "NONE"
  cors {
    allow_origins     = ["*"]
    allow_methods     = ["*"]  # Änderung hier: Wildcard statt spezifischer Methoden
    allow_headers     = ["content-type", "accept"]
    max_age           = 300
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.function_name}-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.function_name}-policy"
  role = aws_iam_role.lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:*:*:table/${var.table_name}"
      }
    ]
  })
}