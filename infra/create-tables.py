# create-tables.py
import boto3
import os
import datetime

# Konfiguration über Umgebungsvariablen
COUNTER_TABLE = os.environ.get('COUNTER_TABLE', 'dev_visitor_counter_aleksanderbauer')
FEEDBACK_TABLE = os.environ.get('FEEDBACK_TABLE', 'dev_feedback_aleksanderbauer')
DYNAMODB_ENDPOINT = 'http://localhost:8000'
REGION = 'eu-north-1'

# DynamoDB-Client mit lokalen Einstellungen
dynamodb = boto3.resource('dynamodb',
                         endpoint_url=DYNAMODB_ENDPOINT,
                         region_name=REGION,
                         aws_access_key_id='fake',
                         aws_secret_access_key='fake')

print(f"Verbindung zu DynamoDB: {DYNAMODB_ENDPOINT}")

# Counter-Tabelle erstellen
try:
    table = dynamodb.create_table(
        TableName=COUNTER_TABLE,
        KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 1, 'WriteCapacityUnits': 1}
    )
    print(f"Tabelle {COUNTER_TABLE} wurde erstellt!")
except Exception as e:
    print(f"Info: {e}")
    print(f"Tabelle {COUNTER_TABLE} existiert möglicherweise bereits.")

# Feedback-Tabelle erstellen
try:
    table = dynamodb.create_table(
        TableName=FEEDBACK_TABLE,
        KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 1, 'WriteCapacityUnits': 1}
    )
    print(f"Tabelle {FEEDBACK_TABLE} wurde erstellt!")
except Exception as e:
    print(f"Info: {e}")
    print(f"Tabelle {FEEDBACK_TABLE} existiert möglicherweise bereits.")

# Initialen Zählerstand setzen
try:
    dynamodb.Table(COUNTER_TABLE).put_item(
        Item={
            'id': '1',
            'views': 0,
            'lastUpdated': datetime.datetime.utcnow().isoformat(),
            'environment': 'dev'
        }
    )
    print(f"Initialer Zählerstand in {COUNTER_TABLE} gesetzt!")
except Exception as e:
    print(f"Fehler beim Setzen des Zählerstands: {e}")

print("Tabellen-Initialisierung abgeschlossen!")