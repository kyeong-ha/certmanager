FROM node:22

WORKDIR /web/frontend

COPY package*.json ./
RUN npm install
COPY . .

COPY --chmod=755 ./entrypoint.sh .
RUN chmod +x /web/frontend/entrypoint.sh

ENTRYPOINT ["sh", "/web/frontend/entrypoint.sh"]