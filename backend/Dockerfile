FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /web

COPY ./requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

COPY ./entrypoint.sh .
RUN chmod +x /web/entrypoint.sh

ENTRYPOINT ["/web/entrypoint.sh"]