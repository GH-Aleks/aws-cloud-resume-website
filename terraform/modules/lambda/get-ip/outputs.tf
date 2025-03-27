output "function_name" {
  description = "Name der Lambda-Funktion für die IP-Adressabfrage"
  value       = aws_lambda_function.get_ip.function_name
}

output "function_arn" {
  description = "ARN der Lambda-Funktion für die IP-Adressabfrage"
  value       = aws_lambda_function.get_ip.arn
}