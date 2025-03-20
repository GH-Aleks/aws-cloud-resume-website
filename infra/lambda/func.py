from flask import Flask, request, jsonify
import boto3
from datetime import datetime
import os

app = Flask(__name__)

# DynamoDB-Client mit expliziten Zugangsdaten
dynamodb = boto3.resource(
    'dynamodb',
    region_name='eu-north-1',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)
table = dynamodb.Table('FeedbackTable')

@app.route('/feedback', methods=['POST'])
def save_feedback():
    try:
        data = request.json
        skill_category = data['skillCategory']
        comment = data['comment']
        company = data.get('company', 'Anonym')
        position = data.get('position', 'Unbekannt')

        table.put_item(Item={
            'id': str(datetime.utcnow()),
            'skillCategory': skill_category,
            'comment': comment,
            'company': company,
            'position': position,
            'createdAt': datetime.utcnow().isoformat()
        })

        return jsonify({'message': 'Feedback erfolgreich gespeichert!'}), 200
    except Exception as e:
        print(f"Fehler: {e}")
        return jsonify({'message': 'Fehler beim Speichern des Feedbacks.'}), 500


# Lambda-Handler (wird von AWS Lambda aufgerufen)
import json
import boto3
from datetime import datetime

# DynamoDB-Client für Lambda
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('FeedbackTable')

def lambda_handler(event, context):
    # CORS-Header für alle Antworten
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
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
            'createdAt': datetime.utcnow().isoformat()
        })
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Feedback erfolgreich gespeichert!'})
        }
    except Exception as e:
        print(f"Fehler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': f'Fehler beim Speichern des Feedbacks: {str(e)}'})
        }

# Lokaler Entwicklungsserver
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)