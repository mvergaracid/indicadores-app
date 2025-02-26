#!/bin/sh

CONFIG_FILE=/usr/share/nginx/html/assets/config.json

mkdir -p $(dirname $CONFIG_FILE)

echo "{
  \"API_URL\": \"${API_URL}\",
  \"API_KEY\": \"${API_KEY}\"
}" > $CONFIG_FILE

echo "Config.json generado con éxito:"
cat $CONFIG_FILE

exec "$@"
