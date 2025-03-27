variable "table_name" {
  description = "Name der DynamoDB-Tabelle"
  type        = string
}

variable "environment" {
  description = "Umgebung (stg, prod)"
  type        = string
}