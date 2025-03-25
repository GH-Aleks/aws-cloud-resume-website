# AWS Cloud Resume Website

Eine serverlose Webseite mit AWS-Services und Multi-Environment-Setup.

## Environments

Das Projekt nutzt drei separate Umgebungen:

- **Development** (dev.aleksanderbauer.de): Tägliche Entwicklung
- **Staging** (stg.aleksanderbauer.de): Tests vor der Produktion
- **Production** (aleksanderbauer.de): Live-System

## Branching-Strategie

- `develop` → Development
- `staging` → Staging
- `main` → Production

## Entwicklungsworkflow

1. Features in Feature-Branches entwickeln
2. PR nach `develop` erstellen und mergen für Dev-Tests
3. PR von `develop` nach `staging` für Staging-Tests
4. PR von `staging` nach `main` für Produktionsrelease

![AWS_Resume](https://github.com/user-attachments/assets/ad2e2ce0-8f9f-4b22-9b0b-fcb58544efc7)

