#!/bin/bash
ID=13
TOKEN="BAhJIiVkMDA4NWM0ZTliZmE2YTFkYjAwMGM1ZTlmNzkxMGI5ZAY6BkVG--1fd536084f7f1a7958b3ee5db1f09fce08038d25"

curl "http://localhost:4741/games/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Token token=${TOKEN}"

echo
