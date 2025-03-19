def lambda_handler(event, context):
    ip_address = event['requestContext']['identity']['sourceIp']
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': f'{{"ip": "{ip_address}"}}'
    }