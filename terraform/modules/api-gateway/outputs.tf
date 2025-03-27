output "api_endpoint" {
  description = "Endpunkt-URL für die API Gateway get_ip-Route"
  value       = "${aws_apigatewayv2_stage.stage.invoke_url}/get_ip"
}

output "api_id" {
  description = "ID des erstellten API Gateways"
  value       = aws_apigatewayv2_api.api.id
}

output "stage_name" {
  description = "Name der API Gateway-Stage"
  value       = aws_apigatewayv2_stage.stage.name
}