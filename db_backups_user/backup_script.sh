#!/bin/bash
set -e

echo "Waiting for PostgreSQL to become available..."
until pg_isready -U postgres; do
  sleep 2
done

if ! psql -U postgres -d user_panel -c "SELECT 1 FROM users LIMIT 1;" | grep -q 1; then
  echo "Restoring user_panel database as the table is empty..."
  pg_restore -U postgres -d user_panel /docker-entrypoint-initdb.d/user_backup
else
  echo "Database user_panel already contains data."
fi