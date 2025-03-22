import json
import os

# Bedingte Konfiguration für lokale vs. Cloud-Umgebung
def get_headers():
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }

def lambda_handler(event, context):
    headers = get_headers()
    
    # Für OPTIONS-Anfragen einfach CORS-Header zurückgeben
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS enabled'})
        }
    
    try:
        # Lokales Environment Check
        if os.environ.get('AWS_REGION') == 'local':
            # Simulierte IP für lokale Entwicklung
            client_ip = '127.0.0.1'
        else:
            # In AWS: IP aus Event-Objekt extrahieren
            client_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'ip': client_ip})
        }
    except Exception as e:
        print(f"Fehler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

# Lokaler Test, nur wenn direkt ausgeführt
if __name__ == "__main__":
    print("Testing IP address retrieval locally")
    result = lambda_handler({}, None)
    print(f"Result: {result}")