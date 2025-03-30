FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY /include.websocket /etc/nginx/web/include.websocket
COPY /include.forwarded /etc/nginx/web/include.forwarded
COPY /nginx.conf /etc/nginx/conf.d