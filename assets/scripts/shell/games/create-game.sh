#!/bin/bash
BOOLEAN=false
SCORE=5
USER_ID=1
TOKEN="BAhJIiVkNmU2YTdlNGQzNDdlNDBiNDMyNzZhYTAxMmU4NGFlYQY6BkVG--f98f105a0bb4c9100b9bb76d894420ffcd3ba02d"

curl "http://localhost:4741/games" \
--include \
--request POST \
--header "Content-Type: application/json" \
--header "Authorization: Token token=${TOKEN}" \
  --data '{
    "game": {
      "over": "'"${BOOLEAN}"'",
      "score": "'"${SCORE}"'",
      "user_id": "'"${USER_ID}"'"
    }
  }'

echo
