#!/bin/bash
TOKEN="BAhJIiVkNmU2YTdlNGQzNDdlNDBiNDMyNzZhYTAxMmU4NGFlYQY6BkVG--f98f105a0bb4c9100b9bb76d894420ffcd3ba02d"

curl "http://localhost:4741/games" \
  --include \
  --request GET \
  --header "Authorization: Token token=${TOKEN}"

echo
