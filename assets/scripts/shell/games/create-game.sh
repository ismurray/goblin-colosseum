#!/bin/bash
BOOLEAN=false
SCORE=5
TOKEN="BAhJIiVlOGY0MGQxZTBlMDYwMTE4MjZhZWI5NzljMzUwNzUyOAY6BkVG--35991a312f2f79f87ccc519272142fa804375009"

curl "http://localhost:4741/games" \
--include \
--request POST \
--header "Content-Type: application/json" \
--header "Authorization: Token token=${TOKEN}" \
  --data '{
    "game": {
      "over": "'"${BOOLEAN}"'",
      "score": "'"${SCORE}"'"
    }
  }'

echo
