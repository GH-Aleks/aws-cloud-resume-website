

resource "aws_dynamodb_table" "counter_table" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  tags = {
    Environment = var.environment
    Project     = "cloud-resume"
    ManagedBy   = "Terraform"
  }
}

resource "aws_dynamodb_table_item" "counter_init" {
  table_name = aws_dynamodb_table.counter_table.name
  hash_key   = aws_dynamodb_table.counter_table.hash_key
  
  item = jsonencode({
    id = {S = "1"},
    views = {N = "0"}
  })
  
  lifecycle {
    ignore_changes = [item]
  }
}


