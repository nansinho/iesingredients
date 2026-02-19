#!/bin/bash
# Initial SSL certificate setup with Let's Encrypt
# Run this ONCE during first deployment on VPS

set -e

DOMAIN=${1:-ies-ingredients.com}
EMAIL=${2:-admin@ies-ingredients.com}

echo "=== Requesting SSL certificate for $DOMAIN ==="

# Ensure nginx is running for the ACME challenge
docker compose up -d nginx

# Request certificate
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# Reload nginx to use the new certificate
docker compose exec nginx nginx -s reload

echo "=== SSL certificate obtained successfully! ==="
echo "Certificate will auto-renew via the certbot container."
