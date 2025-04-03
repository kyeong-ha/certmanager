FROM node:22-slim

WORKDIR /web/frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . .

COPY ./entrypoint.sh .
RUN chmod +x /web/frontend/entrypoint.sh

ENTRYPOINT ["/web/frontend/entrypoint.sh"]