output "function_name" {
  description = "Name der Lambda-Funktion für den Besucher-Counter"
  value       = aws_lambda_function.visitor_counter.function_name
}

output "function_arn" {
  description = "ARN der Lambda-Funktion für den Besucher-Counter"
  value       = aws_lambda_function.visitor_counter.arn
}

output "function_url" {
  description = "Function URL der Lambda-Funktion für den Besucher-Counter"
  value       = aws_lambda_function_url.visitor_counter_url.function_url
}