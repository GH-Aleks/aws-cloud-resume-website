# Infrastruktur-Management mit Terraform

Dieses Dokument beschreibt das Infrastructure-as-Code-Setup für das AWS Cloud Resume Projekt.

## Multi-Environment-Struktur

Die AWS-Infrastruktur wird in drei separaten Umgebungen verwaltet:

- **Development** (dev.aleksanderbauer.de)
- **Staging** (stg.aleksanderbauer.de)
- **Production** (aleksanderbauer.de)

## Terraform-Struktur

- **modules/**: Wiederverwendbare Infrastrukturmodule
  - lambda/: Lambda-Funktionen
  - dynamodb/: DynamoDB-Tabellen
  - api-gateway/: API Gateway-Konfigurationen
  - s3/: S3-Buckets für Website-Hosting
  - cloudfront/: CloudFront-Distributionen

- **environments/**: Umgebungsspezifische Konfigurationen
  - dev/: Entwicklungsumgebung
  - staging/: Staging-Umgebung
  - prod/: Produktionsumgebung

- **backend/**: Terraform State-Konfiguration
  - S3-Bucket und DynamoDB-Tabelle für Remote State

## Workflow

1. Lokaler Entwicklungszyklus mit Docker-Umgebung
2. Terraform-Plan in CI/CD generieren
3. Nach Genehmigung: Terraform Apply durchführen
4. Lambda-URLs in Frontend-Konfiguration einbinden