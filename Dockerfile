FROM nginxinc/nginx-unprivileged:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY game.js /usr/share/nginx/html/game.js

USER 101

EXPOSE 8080