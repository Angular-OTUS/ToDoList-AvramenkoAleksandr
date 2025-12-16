#!/bin/bash
# test_api.sh

# Tests for mock REST API for the TODO Angular application
# NOTE: curl and jq must be installed to use this script

BASE_URL="http://localhost:3000/todos"

echo "=== Testing JSON Server API ==="

# 1. Get all todos
echo -e "\n1. GET all todos:"
curl -s "$BASE_URL" | jq '.[:3]'  # Show first 3

# 2. Create a new todo
echo -e "\n2. POST new todo:"
NEW_TODO=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1234123412412",
    "text": "Test todo",
    "description": "Created by test script",
    "status": "InProgress"
  }')
echo $NEW_TODO | jq '.'
NEW_ID=$(echo $NEW_TODO | jq -r '.id')
echo "New TODO id: $NEW_ID"

# 3. Get the new todo
echo -e "\n3. GET new todo (ID: $NEW_ID):"
curl -s "$BASE_URL/$NEW_ID" | jq '.'

# 4. Update the todo
echo -e "\n4. PATCH update todo:"
curl -s -X PATCH "$BASE_URL/$NEW_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}' | jq '.'

# 5. Delete the todo
echo -e "\n5. DELETE todo:"
curl -s -X DELETE "$BASE_URL/$NEW_ID" | jq '.'

# 6. Verify deletion
echo -e "\n6. Verify deletion (should be 404):"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/$NEW_ID"

echo -e "\n=== Test completed ==="
