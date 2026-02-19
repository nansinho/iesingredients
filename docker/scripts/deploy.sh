#!/bin/bash
# IES Ingredients - VPS Deployment Script
# Usage: ./deploy.sh [first-run|update]

set -e

PROJECT_DIR="/opt/ies-ingredients"
COMPOSE_DIR="$PROJECT_DIR/docker"

case "${1:-update}" in
  first-run)
    echo "=== First-time deployment ==="

    # Clone the repository
    if [ ! -d "$PROJECT_DIR" ]; then
      git clone https://github.com/nansinho/iesingredients.git "$PROJECT_DIR"
    fi

    cd "$COMPOSE_DIR"

    # Check for .env file
    if [ ! -f .env ]; then
      echo "ERROR: Please create $COMPOSE_DIR/.env with required environment variables:"
      echo "  NEXT_PUBLIC_SUPABASE_URL="
      echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY="
      echo "  SUPABASE_SERVICE_ROLE_KEY="
      echo "  NEXT_PUBLIC_SITE_URL=https://ies-ingredients.com"
      echo "  REVALIDATE_SECRET=<random-secret>"
      exit 1
    fi

    # Build and start all services
    docker compose build
    docker compose up -d

    echo ""
    echo "=== Services started ==="
    echo "Next.js: http://localhost:3000"
    echo "LibreTranslate: http://localhost:5000"
    echo ""
    echo "Next steps:"
    echo "1. Configure DNS (A record -> VPS IP)"
    echo "2. Run: ./scripts/init-ssl.sh ies-ingredients.com admin@ies-ingredients.com"
    echo "3. Update nginx config to enable HTTPS"
    echo "4. Submit sitemap to Google Search Console"
    ;;

  update)
    echo "=== Updating deployment ==="
    cd "$PROJECT_DIR"

    # Pull latest code
    git pull origin main

    cd "$COMPOSE_DIR"

    # Rebuild and restart Next.js
    docker compose build --no-cache nextjs
    docker compose up -d nextjs

    # Health check
    sleep 5
    if curl -sf http://localhost:3000/api/health > /dev/null; then
      echo "Health check passed!"
    else
      echo "WARNING: Health check failed. Check logs with: docker compose logs nextjs"
    fi

    echo "=== Update complete ==="
    ;;

  *)
    echo "Usage: $0 [first-run|update]"
    exit 1
    ;;
esac
