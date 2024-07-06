FROM python:3.9-slim

WORKDIR /app

# Upgrade pip and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY senti_ui_api.py .
COPY sentiment_analysis.db .

EXPOSE 5001

CMD ["python", "senti_ui_api.py"]