output "visitor_counter_url" {
  value = module.visitor_counter.function_url
  description = "URL für den Besucher-Zähler"
}

output "feedback_api_url" {
  value = module.feedback_api.function_url
  description = "URL für die Feedback-API"
}

output "get_ip_url" {
  value = module.api_gateway.api_endpoint
  description = "URL für die IP-Adresse-API"
}

output "counter_table" {
  value = module.visitor_counter_table.table_name
  description = "Name der Counter-DynamoDB-Tabelle"
}

output "feedback_table" {
  value = module.feedback_table.table_name
  description = "Name der Feedback-DynamoDB-Tabelle"
}