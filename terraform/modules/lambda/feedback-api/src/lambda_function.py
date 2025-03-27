import json
import boto3
import os
from datetime import datetime
from decimal import Decimal
import uuid

# JSON-Encoder für Decimal-Werte
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

# Dynamische Tabellennamen basierend auf Umgebung
def get_table_name():
    env = os.environ.get('ENV', 'dev')
    base_name = os.environ.get('FEEDBACK_TABLE', 'dev_feedback')
    return base_name

# Gemeinsame Funktion für DynamoDB-Client
def get_dynamodb_client():
    dynamodb_endpoint = os.environ.get('DYNAMODB_ENDPOINT')
    region = os.environ.get('AWS_REGION', 'eu-north-1')
    
    if dynamodb_endpoint:
        print(f"Using local DynamoDB endpoint: {dynamodb_endpoint}")
        return boto3.resource('dynamodb', 
                            endpoint_url=dynamodb_endpoint,
                            region_name=region,
                            aws_access_key_id='fake',
                            aws_secret_access_key='fake')
    else:
        return boto3.resource('dynamodb', region_name=region)

def lambda_handler(event, context):
    # Log der aktuellen Umgebung für Debugging
    env = os.environ.get('ENV', 'dev')
    print(f"Feedback function running in environment: {env}")
    
    # CORS-Header für alle Antworten
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'content-type,accept',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Max-Age': '86400'  # Cache CORS response für 24 Stunden
    }
    
    # Log für Debugging
    print(f"Event erhalten: {json.dumps(event) if isinstance(event, dict) else str(event)}")
    
    # OPTIONS-Anfragen für CORS
    http_method = event.get('requestContext', {}).get('http', {}).get('method')
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS enabled'})
        }
    
    try:
        # DynamoDB-Client und Tabellennamen holen
        dynamodb = get_dynamodb_client()
        table_name = get_table_name()
        table = dynamodb.Table(table_name)
        
        # Body parsen
        if 'body' in event:
            body = event['body']
            if isinstance(body, str):
                body = json.loads(body)
        else:
            # Fallback
            body = event
        
        # Daten extrahieren
        skill_category = body.get('skillCategory')
        comment = body.get('comment')
        company = body.get('company', 'Anonym')
        position = body.get('position', 'Unbekannt')
        
        # Validierung
        if not skill_category or not comment:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'message': 'skillCategory und comment sind erforderlich'})
            }
        
        # In DynamoDB speichern
        feedback_id = str(uuid.uuid4())  # Eindeutige ID
        table.put_item(Item={
            'id': feedback_id,
            'skillCategory': skill_category,
            'comment': comment,
            'company': company,
            'position': position,
            'createdAt': datetime.utcnow().isoformat(),
            'environment': env  # Speichern der Umgebung für spätere Analyse
        })
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Feedback erfolgreich gespeichert!'}, cls=DecimalEncoder)
        }
    except Exception as e:
        print(f"Fehler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': f'Fehler beim Speichern des Feedbacks: {str(e)}'}, cls=DecimalEncoder)
        }

# Lokaler Test, nur wenn direkt ausgeführt
if __name__ == "__main__":
    test_event = {
        'body': json.dumps({
            'skillCategory': 'cloud',
            'comment': 'Test Feedback',
            'company': 'Test GmbH',
            'position': 'Junior Cloud Engineer'
        })
    }
    print("Testing feedback API locally")
    result = lambda_handler(test_event, None)
    print(f"Result: {result}")