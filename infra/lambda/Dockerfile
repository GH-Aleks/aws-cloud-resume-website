# Basis-Image für Python
FROM python:3.9-slim

# Arbeitsverzeichnis im Container erstellen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Anwendungscode kopieren
COPY func.py .

# Port für den Container öffnen
EXPOSE 8080

# Startbefehl für die Anwendung
CMD ["python", "func.py"]