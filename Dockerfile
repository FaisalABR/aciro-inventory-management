FROM node:18-alpine AS node_builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources resources
COPY vite.config.js ./
RUN npm run build

FROM composer:2.7 AS php_builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-scripts --no-progress
COPY . .
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress

FROM php:8.3-fpm-alpine
RUN apk add --no-cache nginx supervisor bash git icu-dev libzip-dev oniguruma-dev postgresql-dev \ 
    && docker-php-ext-install pdo pdo_pgsql zip intl bcmath opcache

COPY --from=php_builder /app /var/www/html
COPY --from=node_builder /app/dist /var/wwww/html/public/build

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker/nginx.conf /etc/nginx/nginx.conf

COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]