FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY insertData.py .
COPY smoke_detection_iot.csv . 

CMD ["python", "insertData.py"]
