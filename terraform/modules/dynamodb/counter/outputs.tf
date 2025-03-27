output "table_name" {
  description = "Name der DynamoDB-Tabelle für den Besucher-Counter"
  value       = aws_dynamodb_table.counter_table.name
}

output "table_arn" {
  description = "ARN der DynamoDB-Tabelle für den Besucher-Counter"
  value       = aws_dynamodb_table.counter_table.arn
}