from flask import Flask, request, jsonify
import boto3
from datetime import datetime

app = Flask(__name__)

# DynamoDB-Client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FeedbackTable')  # Ersetze mit deinem Tabellennamen

@app.route('/feedback', methods=['POST'])
def save_feedback():
    try:
        # Feedback-Daten aus der Anfrage extrahieren
        data = request.json
        skill_category = data['skillCategory']
        comment = data['comment']
        company = data.get('company', 'Anonym')
        position = data.get('position', 'Unbekannt')

        # Feedback in DynamoDB speichern
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)