variable "environment" {
  description = "Umgebung (dev, stg, prod)"
  type        = string
}

variable "api_name" {
  description = "Name der API"
  type        = string
}

variable "lambda_function_name" {
  description = "Name der Lambda-Funktion"
  type        = string
}

variable "lambda_function_arn" {
  description = "ARN der Lambda-Funktion"
  type        = string
}

variable "stage_name" {
  description = "Name der API-Stage"
  type        = string
  default     = "default"
}

resource "aws_apigatewayv2_api" "api" {
  name          = var.api_name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "OPTIONS"]
    allow_headers = ["content-type", "accept"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.stage_name
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = var.lambda_function_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_ip_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /get_ip"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/get_ip"
}
