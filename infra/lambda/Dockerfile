FROM amazon/aws-lambda-python:3.9

WORKDIR /var/task
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY func.py .

CMD ["func.lambda_handler"]