#!/usr/bin/env sh
# ── DuckDNS IP Updater ──────────────────────────────────────────
# Run this script every 5 minutes via cron to keep your DuckDNS
# domain pointing to your VPS public IP.
#
# Setup:
#   1. chmod +x duckdns.sh
#   2. crontab -e
#   3. Add: */5 * * * * /home/ubuntu/totem-ia/duckdns.sh
#
# Requires DOMAIN and DUCKDNS_TOKEN in .env or exported as env vars
# ─────────────────────────────────────────────────────────────────

# Load .env if present
if [ -f "$(dirname "$0")/.env" ]; then
    . "$(dirname "$0")/.env"
fi

DOMAIN="${DOMAIN:-meutotem}"
TOKEN="${DUCKDNS_TOKEN:-}"

if [ -z "$TOKEN" ]; then
    echo "DUCKDNS_TOKEN not set. Add it to .env"
    exit 1
fi

# Strip .duckdns.org suffix if present (DuckDNS API expects just the subdomain)
DOMAIN="${DOMAIN%.duckdns.org}"

echo "Updating DuckDNS: $DOMAIN ..."
curl -s "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="
echo ""
