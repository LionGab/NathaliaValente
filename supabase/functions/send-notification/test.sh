#!/bin/bash

# ClubNath Notification System - Testing Script
#
# This script helps you test the notification system end-to-end
# Make sure to set your environment variables before running

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_URL="${SUPABASE_URL:-https://your-project.supabase.co}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-your-anon-key}"
TEST_USER_ID="${TEST_USER_ID:-test-user-id}"

echo -e "${GREEN}=== ClubNath Notification System Test ===${NC}\n"

# Function to call notification API
send_notification() {
  local payload=$1
  local description=$2

  echo -e "${YELLOW}Testing: ${description}${NC}"

  response=$(curl -s -X POST \
    "${SUPABASE_URL}/functions/v1/send-notification" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -d "$payload")

  echo "Response: $response"

  if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Success${NC}\n"
  else
    echo -e "${RED}✗ Failed${NC}\n"
  fi
}

# Test 1: Simple custom notification
echo -e "${GREEN}--- Test 1: Custom Notification ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "custom_title": "Olá! Teste de Notificação",
  "custom_body": "Esta é uma notificação de teste do ClubNath!",
  "custom_deep_link": "/home"
}' "Custom notification"

# Test 2: Template-based notification (Morning Encouragement)
echo -e "${GREEN}--- Test 2: Morning Encouragement Template ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "template_key": "morning_encouragement",
  "template_data": {
    "quote_content": "Você é incrível e está fazendo um ótimo trabalho!",
    "quote_author": "ClubNath"
  }
}' "Morning encouragement template"

# Test 3: New comment notification
echo -e "${GREEN}--- Test 3: New Comment Notification ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "template_key": "new_comment",
  "template_data": {
    "commenter_name": "Maria Silva",
    "comment_content": "Que post lindo! Muito inspirador!",
    "post_id": "123",
    "post_caption": "Meu dia de mãe"
  }
}' "New comment notification"

# Test 4: Nathy badge notification (high priority)
echo -e "${GREEN}--- Test 4: Nathy Badge (High Priority) ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "template_key": "nathy_badge_received",
  "template_data": {
    "post_id": "123",
    "post_caption": "Compartilhando minha jornada"
  },
  "priority": "high"
}' "Nathy badge notification"

# Test 5: Scheduled notification
echo -e "${GREEN}--- Test 5: Scheduled Notification ---${NC}"
# Schedule for 1 minute from now
scheduled_time=$(date -u -d "+1 minute" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+1M +"%Y-%m-%dT%H:%M:%SZ")
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "template_key": "journal_reminder",
  "scheduled_for": "'$scheduled_time'"
}' "Scheduled notification (1 minute from now)"

# Test 6: Journal reminder
echo -e "${GREEN}--- Test 6: Journal Reminder ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "template_key": "journal_reminder"
}' "Journal reminder"

# Test 7: New post in category
echo -e "${GREEN}--- Test 7: New Post in Category ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "template_key": "new_post_in_category",
  "template_data": {
    "category_name": "Fé",
    "author_name": "Ana Paula",
    "post_caption": "Compartilhando minha fé e esperança",
    "post_id": "456"
  },
  "priority": "low"
}' "New post in category"

# Test 8: Push-only notification
echo -e "${GREEN}--- Test 8: Push-Only Notification ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "custom_title": "Notificação Push",
  "custom_body": "Esta notificação será enviada apenas via push",
  "delivery_method": "push"
}' "Push-only notification"

# Test 9: In-app only notification
echo -e "${GREEN}--- Test 9: In-App Only Notification ---${NC}"
send_notification '{
  "user_id": "'$TEST_USER_ID'",
  "custom_title": "Notificação In-App",
  "custom_body": "Esta notificação aparece apenas no app",
  "delivery_method": "in_app"
}' "In-app only notification"

echo -e "${GREEN}=== All Tests Completed ===${NC}\n"

# Instructions for manual verification
echo -e "${YELLOW}Manual Verification Steps:${NC}"
echo "1. Check the notification_history table in Supabase"
echo "2. Verify push notifications on your device (if tokens registered)"
echo "3. Check in-app notifications in the NotificationCenter component"
echo "4. Wait 1 minute to verify the scheduled notification"
echo ""
echo -e "${YELLOW}SQL Query to check results:${NC}"
echo "SELECT id, title, body, status, delivery_method, created_at"
echo "FROM notification_history"
echo "WHERE user_id = '$TEST_USER_ID'"
echo "ORDER BY created_at DESC"
echo "LIMIT 10;"
echo ""

# Test scheduled notification processor
echo -e "${GREEN}--- Testing Scheduled Notification Processor ---${NC}"
echo "Waiting 70 seconds for scheduled notification to be due..."
sleep 70

echo "Calling processor..."
processor_response=$(curl -s -X POST \
  "${SUPABASE_URL}/functions/v1/process-scheduled-notifications" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: ${CRON_SECRET:-test-secret}")

echo "Processor response: $processor_response"
echo ""

echo -e "${GREEN}Testing complete!${NC}"
