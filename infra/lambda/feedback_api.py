from flask import Flask, request, jsonify
import boto3
from datetime import datetime
import os
import json
from decimal import Decimal

# JSON-Encoder für Decimal-Werte
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

# Dynamische Tabellennamen basierend auf Umgebung
def get_table_name():
    env = os.environ.get('ENV', 'dev')
    table_name = os.environ.get('FEEDBACK_TABLE', f'{env}_feedback')
    print(f"Using table name: {table_name} for environment: {env}")
    return table_name

# Gemeinsame Funktion für DynamoDB-Client
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

# Flask-App für lokale Entwicklung
app = Flask(__name__)

@app.route('/feedback', methods=['POST'])
def save_feedback():
    try:
        # DynamoDB-Client und Tabellennamen holen
        dynamodb = get_dynamodb_client()
        table_name = get_table_name()
        table = dynamodb.Table(table_name)
        
        data = request.json
        skill_category = data['skillCategory']
        comment = data['comment']
        company = data.get('company', 'Anonym')
        position = data.get('position', 'Unbekannt')

        # Umgebung für Cross-Environment-Analysen speichern
        env = os.environ.get('ENV', 'dev')

        table.put_item(Item={
            'id': str(datetime.utcnow()),
            'skillCategory': skill_category,
            'comment': comment,
            'company': company,
            'position': position,
            'createdAt': datetime.utcnow().isoformat(),
            'environment': env
        })

        return jsonify({'message': 'Feedback erfolgreich gespeichert!'}), 200
    except Exception as e:
        print(f"Fehler: {e}")
        return jsonify({'message': f'Fehler beim Speichern des Feedbacks: {str(e)}'}), 500

# Lambda-Handler für AWS
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
    print(f"Event erhalten: {json.dumps(event)}")
    
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
        
        # In DynamoDB speichern
        table.put_item(Item={
            'id': str(datetime.utcnow().timestamp()),  # Bessere ID
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

# Lokaler Entwicklungsserver
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)