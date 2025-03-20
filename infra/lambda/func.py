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
def lambda_handler(event, context):
    """AWS Lambda Function Handler zur Verarbeitung von API Gateway Anfragen"""
    # HTTP-Methode und Body aus dem Event extrahieren
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    body = event.get('body', '{}')
    
    # Wenn es eine POST-Anfrage an den Feedback-Endpunkt ist
    if method == 'POST' and path.endswith('/feedback'):
        try:
            import json
            data = json.loads(body)
            # Feedback-Logik aus deiner save_feedback-Funktion
            skill_category = data.get('skillCategory')
            comment = data.get('comment')
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
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'  # CORS-Unterstützung
                },
                'body': json.dumps({'message': 'Feedback erfolgreich gespeichert!'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': f'Fehler: {str(e)}'})
            }
    
    # Standard-Antwort
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Hello from Feedback API'})
    }

# Lokaler Entwicklungsserver
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)