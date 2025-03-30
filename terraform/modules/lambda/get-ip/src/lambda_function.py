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
    print(f"Event structure: {json.dumps(event)}")  # Hilft bei der Fehlerbehebung
    
    headers = get_headers()
    
    # Für OPTIONS-Anfragen einfach CORS-Header zurückgeben
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS' or event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS enabled'})
        }
    
    try:
        # Umgebungsspezifische IP-Adressbestimmung
        if os.environ.get('DYNAMODB_ENDPOINT'):  # Lokale Entwicklungsumgebung
            client_ip = '127.0.0.1'
            print(f"Using simulated IP address for local development in {env} environment")
        else:
            # Multi-Format-Unterstützung für verschiedene API Gateway-Typen
            client_ip = 'unknown'
            req_context = event.get('requestContext', {})
            
            # 1. REST API Gateway (v1) Format - für dev-Umgebung
            if 'identity' in req_context:
                client_ip = req_context.get('identity', {}).get('sourceIp', 'unknown')
                print(f"IP extracted from REST API format: {client_ip}")
            
            # 2. HTTP API Gateway (v2) Format - für stg und prod Umgebungen
            elif 'http' in req_context:
                client_ip = req_context.get('http', {}).get('sourceIp', 'unknown')
                print(f"IP extracted from HTTP API format: {client_ip}")
            
            # 3. Fallback auf Header-Informationen
            elif 'headers' in event:
                headers_lower = {k.lower(): v for k, v in event.get('headers', {}).items()}
                if 'x-forwarded-for' in headers_lower:
                    client_ip = headers_lower['x-forwarded-for'].split(',')[0].strip()
                    print(f"IP extracted from headers: {client_ip}")
                else:
                    client_ip = 'unknown-headers'
            else:
                client_ip = 'unknown-format'
            
            print(f"Final client IP determination: {client_ip} in {env} environment")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'ip': client_ip,
                'environment': env
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
    # Simuliere REST API Event
    rest_event = {"requestContext": {"identity": {"sourceIp": "192.168.1.1"}}}
    # Simuliere HTTP API Event
    http_event = {"requestContext": {"http": {"sourceIp": "192.168.1.2"}}}
    
    print(f"REST API test result: {lambda_handler(rest_event, None)}")
    print(f"HTTP API test result: {lambda_handler(http_event, None)}")