variable "aws_region" {
  description = "AWS-Region für alle Ressourcen"
  type        = string
  default     = "eu-north-1"
}

variable "environment" {
  description = "Umgebungsname (stg)"
  type        = string
  default     = "stg"
}

variable "counter_table_name" {
  description = "Name der DynamoDB-Tabelle für den Besucherzähler"
  type        = string
  default     = "stg_visitor_counter"
}

variable "feedback_table_name" {
  description = "Name der DynamoDB-Tabelle für Feedback"
  type        = string
  default     = "stg_feedback"
}

variable "visitor_counter_function_name" {
  description = "Name der Lambda-Funktion für den Besucherzähler"
  type        = string
  default     = "stg-visitor-counter"
}

variable "feedback_api_function_name" {
  description = "Name der Lambda-Funktion für die Feedback-API"
  type        = string
  default     = "stg-feedback-api"
}

variable "get_ip_function_name" {
  description = "Name der Lambda-Funktion für IP-Adressabfrage"
  type        = string
  default     = "stg-get-ip"
}

variable "api_gateway_stage_name" {
  description = "Name der API Gateway-Stage"
  type        = string
  default     = "stg"
}