FROM node:22-slim

WORKDIR /web/frontend

COPY . .

COPY --chmod=755 ./entrypoint.sh .
RUN chmod +x /web/frontend/entrypoint.sh

ENTRYPOINT ["sh", "/web/frontend/entrypoint.sh"]