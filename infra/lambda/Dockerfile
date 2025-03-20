FROM public.ecr.aws/lambda/python:3.9

# Kopiere Anforderungen und installiere sie
COPY requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install --no-cache-dir -r requirements.txt

# Kopiere den Funktionscode
COPY func.py ${LAMBDA_TASK_ROOT}

# Setze den Lambda-Handler
CMD ["func.lambda_handler"]