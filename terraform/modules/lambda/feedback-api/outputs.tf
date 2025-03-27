output "function_name" {
  description = "Name der Lambda-Funktion für die Feedback-API"
  value       = aws_lambda_function.feedback_api.function_name
}

output "function_arn" {
  description = "ARN der Lambda-Funktion für die Feedback-API"
  value       = aws_lambda_function.feedback_api.arn
}

output "function_url" {
  description = "Function URL der Lambda-Funktion für die Feedback-API"
  value       = aws_lambda_function_url.feedback_api_url.function_url
}