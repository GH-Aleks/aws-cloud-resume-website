# Build-Stage: Installiere Dependencies in einer separaten Schicht
FROM public.ecr.aws/lambda/python:3.9 AS builder
WORKDIR ${LAMBDA_TASK_ROOT}

# Kopiere nur die requirements.txt zuerst für besseres Layer-Caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Runtime-Stage: Standard Lambda Image mit Runtime Interface Emulator
FROM public.ecr.aws/lambda/python:3.9
WORKDIR ${LAMBDA_TASK_ROOT}

# Kopiere nur die installierten Pakete und den Funktionscode
COPY --from=builder ${LAMBDA_TASK_ROOT} ${LAMBDA_TASK_ROOT}
COPY *.py ${LAMBDA_TASK_ROOT}/

# Setze Berechtigungen für mehr Sicherheit
RUN chmod 644 ${LAMBDA_TASK_ROOT}/*.py \
    && python -m compileall ${LAMBDA_TASK_ROOT}

# Nicht-Root Benutzer für mehr Sicherheit
USER 1000

# Lambda-Handler wird über CMD im docker-compose definiert
# KEIN CMD HIER - wird im docker-compose definiert