#!/bin/sh
set -e

# Build frontend jika belum ada build
if [ ! -d "public/build" ]; then
  echo "⚙️  Building frontend (Vite)..."
  npm ci --silent
  npm run build
else
  echo "✅ Frontend already built, skipping..."
fi

# Jalankan migrasi dan cache config
php artisan migrate --force || true
php artisan config:cache
php artisan route:cache

# Start supervisord (nginx + php-fpm + reverb)
exec /usr/bin/supervisord -c /etc/supervisord.conf
