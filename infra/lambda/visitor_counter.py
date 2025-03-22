import json
import boto3
import os
from datetime import datetime
from decimal import Decimal

# JSON-Encoder für Decimal-Werte
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

# Bedingte DynamoDB-Konfiguration für lokale vs. Cloud-Umgebung
def get_dynamodb_client():
    dynamodb_endpoint = os.environ.get('DYNAMODB_ENDPOINT')
    region = os.environ.get('AWS_REGION', 'eu-north-1')
    
    if dynamodb_endpoint:
        print(f"Using local DynamoDB endpoint: {dynamodb_endpoint}")
        return boto3.resource('dynamodb', endpoint_url=dynamodb_endpoint)
    else:
        return boto3.resource(
            'dynamodb',
            region_name=region,
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )

# CORS-Header für alle Antworten
headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
}

def lambda_handler(event, context):
    # Für OPTIONS-Anfragen einfach CORS-Header zurückgeben
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS enabled'})
        }
    
    try:
        # DynamoDB-Client und Tabellennamen bekommen
        dynamodb = get_dynamodb_client()
        table_name = os.environ.get('COUNTER_TABLE', 'cloudresume-test')
        table = dynamodb.Table(table_name)
        
        # Abrufen des aktuellen Zählerstands
        try:
            response = table.get_item(Key={'id': '1'})
            views = response.get('Item', {}).get('views', 0)
        except Exception as e:
            print(f"Fehler beim Abrufen des Zählers: {str(e)}")
            # Falls Eintrag noch nicht existiert
            views = 0
        
        # Zähler erhöhen
        views = views + 1
        
        # Aktualisieren des Zählers in DynamoDB
        table.put_item(Item={
            'id': '1',
            'views': views,
            'lastUpdated': datetime.utcnow().isoformat()
        })
        
        # Zählerstand zurückgeben - mit DecimalEncoder
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(views, cls=DecimalEncoder)
        }
        
    except Exception as e:
        print(f"Fehler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            # Auch hier DecimalEncoder verwenden!
            'body': json.dumps({'error': str(e)}, cls=DecimalEncoder)
        }

# Lokaler Test, nur wenn direkt ausgeführt
if __name__ == "__main__":
    print("Testing visitor counter locally")
    result = lambda_handler({}, None)
    print(f"Result: {result}")