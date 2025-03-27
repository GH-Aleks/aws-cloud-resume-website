output "table_name" {
  description = "Name der DynamoDB-Tabelle für Feedback"
  value       = aws_dynamodb_table.feedback_table.name
}

output "table_arn" {
  description = "ARN der DynamoDB-Tabelle für Feedback"
  value       = aws_dynamodb_table.feedback_table.arn
}