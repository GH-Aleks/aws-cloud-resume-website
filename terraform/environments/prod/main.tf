provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {}
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# DynamoDB-Tabellen
module "visitor_counter_table" {
  source = "../../modules/dynamodb/counter"
  
  table_name  = var.counter_table_name
  environment = var.environment
}

module "feedback_table" {
  source = "../../modules/dynamodb/feedback"
  
  table_name  = var.feedback_table_name
  environment = var.environment
}

# Lambda-Funktionen
module "visitor_counter" {
  source = "../../modules/lambda/visitor-counter"
  
  environment   = var.environment
  function_name = var.visitor_counter_function_name
  table_name    = var.counter_table_name
}

module "feedback_api" {
  source = "../../modules/lambda/feedback-api"
  
  environment   = var.environment
  function_name = var.feedback_api_function_name
  table_name    = var.feedback_table_name
}

module "get_ip" {
  source = "../../modules/lambda/get-ip"
  
  environment   = var.environment
  function_name = var.get_ip_function_name
}

# API Gateway für IP-API
module "api_gateway" {
  source = "../../modules/api-gateway"
  
  environment          = var.environment
  api_name             = "prod-ip-api"
  stage_name           = var.api_gateway_stage_name
  lambda_function_name = module.get_ip.function_name
  lambda_function_arn  = module.get_ip.function_arn
}

# Generiere API-Konfigurationsdatei für Frontend
resource "local_file" "api_config" {
  content = jsonencode({
    visitor_counter = module.visitor_counter.function_url,
    feedback_api    = module.feedback_api.function_url,
    get_ip          = module.api_gateway.api_endpoint
  })
  filename = "${path.module}/../../../website/api-urls-${var.environment}.json"
}