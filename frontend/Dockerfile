FROM node:22-slim

WORKDIR /web/frontend

COPY . .

COPY ./entrypoint.sh .
RUN chmod +x /web/frontend/entrypoint.sh

ENTRYPOINT ["/web/frontend/entrypoint.sh"]