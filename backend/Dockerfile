FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=-1

WORKDIR /web/backend

COPY ./requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

COPY ./entrypoint.sh .
RUN chmod +x /web/backend/entrypoint.sh

ENTRYPOINT ["/web/backend/entrypoint.sh"]