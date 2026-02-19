#!/bin/bash
# PostgreSQL backup script for Supabase self-hosted
# Add to crontab: 0 3 * * * /opt/ies-ingredients/docker/scripts/backup-db.sh

set -e

BACKUP_DIR="/opt/ies-ingredients/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/ies_backup_$TIMESTAMP.sql.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run pg_dump inside the Supabase PostgreSQL container
echo "Starting backup at $(date)..."
docker exec ies-supabase-db pg_dump -U postgres -d postgres | gzip > "$BACKUP_FILE"

# Check if backup was created successfully
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup created: $BACKUP_FILE ($SIZE)"
else
  echo "ERROR: Backup failed!"
  exit 1
fi

# Remove backups older than RETENTION_DAYS
find "$BACKUP_DIR" -name "ies_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Old backups cleaned (keeping $RETENTION_DAYS days)"

echo "Backup completed at $(date)"
