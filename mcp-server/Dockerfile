FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && apt-get install -y curl

RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
