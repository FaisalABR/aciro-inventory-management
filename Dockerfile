# ======================
# 1️⃣ Build Frontend (Vite)
# ======================
FROM node:18-alpine AS node_builder
WORKDIR /app

# Install dependencies & build
COPY package*.json ./
RUN npm ci
COPY resources resources
COPY vite.config.ts ./
RUN npm run build

# ======================
# 2️⃣ Build Backend (Laravel)
# ======================
FROM composer:2.7 AS php_builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-scripts --no-progress
COPY . .
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress --no-scripts

# ======================
# 3️⃣ Final Runtime Image
# ======================
FROM php:8.3-fpm-alpine

# Install system deps
RUN apk add --no-cache nginx supervisor bash git icu-dev libzip-dev oniguruma-dev postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql zip intl bcmath opcache pcntl

# Copy Laravel app & frontend build
COPY --from=php_builder /app /var/www/html
COPY --from=node_builder /app/public/build /var/www/html/public/build

# Set working dir
WORKDIR /var/www/html

# Permissions for Laravel storage/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy config files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf

# Expose HTTP port
EXPOSE 80

# Start services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
