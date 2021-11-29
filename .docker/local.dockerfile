FROM node:12-alpine AS build-stage
WORKDIR /app/
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build:local

FROM nginx:1.13.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html/