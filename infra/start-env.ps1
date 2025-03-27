# start-env.ps1
param (
    [string]$user = "aleksanderbauer"
)

Write-Host "Starte lokale Entwicklungsumgebung für Benutzer: $user" -ForegroundColor Green

# 1. Umgebungsvariablen setzen
$ENV:DYNAMODB_DATA_PATH = "dynamodb-data-$user"
$ENV:COUNTER_TABLE = "dev_visitor_counter_$user"
$ENV:FEEDBACK_TABLE = "dev_feedback_$user"
$ENV:COUNTER_API_PORT = 9002
$ENV:FEEDBACK_API_PORT = 9000
$ENV:IP_API_PORT = 9001

# 2. Docker BuildKit deaktivieren
$ENV:DOCKER_BUILDKIT = 0
$ENV:COMPOSE_DOCKER_CLI_BUILD = 0

# 3. Docker-Container starten
Write-Host "Starte Docker-Container..." -ForegroundColor Yellow
docker-compose up -d

# 4. Überprüfe, ob Container laufen
Write-Host "Überprüfe laufende Container:" -ForegroundColor Yellow
docker ps

# 5. DynamoDB-Tabellen initialisieren
Write-Host "Initialisiere DynamoDB-Tabellen..." -ForegroundColor Yellow
python ./create-tables.py

# 6. Ausgabe der API-Endpunkte
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Lokale Entwicklungsumgebung ist bereit!" -ForegroundColor Green
Write-Host "Visitor Counter API: http://localhost:9002/2015-03-31/functions/function/invocations" -ForegroundColor Cyan
Write-Host "Feedback API: http://localhost:9000/2015-03-31/functions/function/invocations" -ForegroundColor Cyan
Write-Host "Get IP API: http://localhost:9001/2015-03-31/functions/function/invocations" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Frontend starten: 'cd ../website && python -m http.server 8080'" -ForegroundColor Yellow
Write-Host "Stoppen der Umgebung: 'docker-compose down'" -ForegroundColor Yellow