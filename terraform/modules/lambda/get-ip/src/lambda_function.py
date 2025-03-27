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
    # Log der aktuellen Umgebung für Debugging
    env = os.environ.get('ENV', 'dev')
    print(f"IP function running in environment: {env}")
    
    headers = get_headers()
    
    # Für OPTIONS-Anfragen einfach CORS-Header zurückgeben
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS enabled'})
        }
    
    try:
        # Umgebungsspezifische IP-Adressbestimmung
        if os.environ.get('DYNAMODB_ENDPOINT'):  # Lokale Entwicklungsumgebung
            # Simulierte IP für lokale Entwicklung
            client_ip = '127.0.0.1'
            print(f"Using simulated IP address for local development in {env} environment")
        else:
            # In AWS: IP aus Event-Objekt extrahieren
            client_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
            print(f"Extracted client IP: {client_ip} in {env} environment")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'ip': client_ip,
                'environment': env  # Optional: Umgebungsinfo im Response
            })
        }
    except Exception as e:
        print(f"Fehler in environment {env}: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

# Lokaler Test, nur wenn direkt ausgeführt
if __name__ == "__main__":
    # Setze ENV für lokalen Test
    if not os.environ.get('ENV'):
        os.environ['ENV'] = 'dev'
    
    print("Testing IP address retrieval locally")
    result = lambda_handler({}, None)
    print(f"Result: {result}")