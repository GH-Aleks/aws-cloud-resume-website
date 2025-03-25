#!/bin/bash
set -e

# Neuen Entwickler anlegen
if [ "$#" -lt 2 ]; then
  echo "Verwendung: $0 benutzername email"
  exit 1
fi

USER_NAME=$1
USER_EMAIL=$2
USER_PASSWORD=$(openssl rand -base64 12)

# Environment-Datei erstellen
cat > user-configs/.env.${USER_NAME} << EOT
# User: ${USER_NAME} (${USER_EMAIL})
# Erstellt: $(date)
ENV=dev
AWS_DEFAULT_REGION=eu-north-1
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=dev-${USER_NAME}
AWS_SECRET_ACCESS_KEY=${USER_PASSWORD}
DYNAMODB_ENDPOINT=http://dynamodb-local:8000
DYNAMODB_DATA_PATH=./dynamodb-data-${USER_NAME}
COUNTER_TABLE=dev_visitor_counter_${USER_NAME}
FEEDBACK_TABLE=dev_feedback_${USER_NAME}
API_ENDPOINT_BASE=http://localhost
FEEDBACK_API_PORT=9000
IP_API_PORT=9001
COUNTER_API_PORT=9002
EOT

echo "✅ Entwickler ${USER_NAME} wurde angelegt."
echo "🔑 Password: ${USER_PASSWORD}"
echo "📁 Konfigurationsdatei: infra/user-configs/.env.${USER_NAME}"