FROM node:10-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:stable-alpine
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist /var/www/

EXPOSE 80
