param (
    [string]$env = "stg"  # Default ist "stg"
)

# Validiere Environment Parameter
if ($env -ne "stg" -and $env -ne "prod") {
    Write-Host "Fehler: Environment muss 'stg' oder 'prod' sein." -ForegroundColor Red
    exit 1
}

Write-Host "Lambda-Funktionen für $env-Umgebung werden paketiert..." -ForegroundColor Cyan

# Absoluten Pfad zum Projektverzeichnis festlegen
$projectRoot = "C:\Users\Home\Desktop\aws-cloud-resume-website"

$lambdaModules = @(
    @{name="visitor-counter"; source="visitor_counter.py"},
    @{name="feedback-api"; source="feedback_api.py"},
    @{name="get-ip"; source="get_ip.py"}
)

foreach ($module in $lambdaModules) {
    $moduleName = $module.name
    $sourceFile = $module.source
    $sourcePath = Join-Path -Path $projectRoot -ChildPath "terraform\modules\lambda\$moduleName\src"
    $moduleBasePath = Join-Path -Path $projectRoot -ChildPath "terraform\modules\lambda\$moduleName"
    
    # Erstelle src-Verzeichnis, falls es nicht existiert
    if (-not (Test-Path $sourcePath)) {
        New-Item -ItemType Directory -Path $sourcePath -Force
        Write-Host "Verzeichnis $sourcePath erstellt" -ForegroundColor Yellow
    }
    
    # Kopiere aktuellen Lambda-Code aus dem infra-Verzeichnis
    $sourceLambda = Join-Path -Path $projectRoot -ChildPath "infra\lambda\$sourceFile"
    if (Test-Path $sourceLambda) {
        Copy-Item $sourceLambda -Destination "$sourcePath\lambda_function.py" -Force
        Write-Host "Lambda-Code aus $sourceLambda nach $sourcePath\lambda_function.py kopiert" -ForegroundColor Green
    } else {
        Write-Host "WARNUNG: Quelldatei $sourceLambda nicht gefunden!" -ForegroundColor Red
    }
    
    # ZIP-Datei erstellen
    $zipPath = "$moduleBasePath\function.zip"
    
    Write-Host "Paketiere $moduleName für $env-Umgebung..." -ForegroundColor Cyan
    
    # Prüfe, ob Dateien zum Komprimieren vorhanden sind
    if (Test-Path "$sourcePath\lambda_function.py") {
        Compress-Archive -Path "$sourcePath\*" -DestinationPath $zipPath -Force
        Write-Host "Lambda-Funktion $moduleName wurde nach $zipPath paketiert" -ForegroundColor Green
    } else {
        Write-Host "FEHLER: Keine Dateien zum Komprimieren in $sourcePath gefunden!" -ForegroundColor Red
    }
}

Write-Host "Lambda-Paketierung für $env-Umgebung abgeschlossen!" -ForegroundColor Cyan
Write-Host "Terraform kann jetzt für die $env-Umgebung ausgeführt werden." -ForegroundColor Green