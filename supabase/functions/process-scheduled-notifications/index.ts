import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';
import type { NotificationSchedule } from '../shared/notification-types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Process Scheduled Notifications
 *
 * This function should be called periodically (e.g., every 5 minutes via cron)
 * to process and send scheduled notifications that are due.
 */

function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

async function processScheduledNotifications(): Promise<{
  processed: number;
  sent: number;
  failed: number;
  details: any[];
}> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  // Get all pending scheduled notifications that are due
  const { data: scheduledNotifications, error } = await supabase
    .from('notification_schedule')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .order('scheduled_for', { ascending: true })
    .limit(100); // Process max 100 at a time

  if (error) {
    console.error('Error fetching scheduled notifications:', error);
    throw error;
  }

  if (!scheduledNotifications || scheduledNotifications.length === 0) {
    return {
      processed: 0,
      sent: 0,
      failed: 0,
      details: [],
    };
  }

  console.log(`Processing ${scheduledNotifications.length} scheduled notifications`);

  let sent = 0;
  let failed = 0;
  const details: any[] = [];

  // Process each notification
  for (const scheduled of scheduledNotifications as NotificationSchedule[]) {
    try {
      // Call send-notification function
      const sendNotificationUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`;
      const response = await fetch(sendNotificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          user_id: scheduled.user_id,
          template_key: scheduled.template_key,
          template_data: scheduled.template_data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        sent++;

        // Update schedule status
        await supabase
          .from('notification_schedule')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', scheduled.id);

        // Handle recurrence
        if (scheduled.recurrence) {
          const nextScheduled = calculateNextRecurrence(
            scheduled.scheduled_for,
            scheduled.recurrence
          );

          await supabase.from('notification_schedule').insert({
            user_id: scheduled.user_id,
            template_key: scheduled.template_key,
            scheduled_for: nextScheduled,
            recurrence: scheduled.recurrence,
            template_data: scheduled.template_data,
          });

          details.push({
            id: scheduled.id,
            status: 'sent',
            next_scheduled: nextScheduled,
          });
        } else {
          details.push({
            id: scheduled.id,
            status: 'sent',
          });
        }
      } else {
        failed++;

        // Mark as failed
        await supabase
          .from('notification_schedule')
          .update({
            status: 'sent', // Mark as sent even if failed to avoid retry loops
            sent_at: new Date().toISOString(),
          })
          .eq('id', scheduled.id);

        details.push({
          id: scheduled.id,
          status: 'failed',
          error: result.message,
        });
      }
    } catch (error) {
      failed++;
      console.error(`Error processing scheduled notification ${scheduled.id}:`, error);

      details.push({
        id: scheduled.id,
        status: 'error',
        error: error.message,
      });
    }
  }

  return {
    processed: scheduledNotifications.length,
    sent,
    failed,
    details,
  };
}

/**
 * Calculate next recurrence date
 */
function calculateNextRecurrence(
  currentDate: string,
  recurrence: string
): string {
  const current = new Date(currentDate);
  const next = new Date(current);

  switch (recurrence) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      next.setDate(next.getDate() + 1);
  }

  return next.toISOString();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify cron secret for security (optional)
    const cronSecret = req.headers.get('x-cron-secret');
    const expectedSecret = Deno.env.get('CRON_SECRET');

    if (expectedSecret && cronSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const result = await processScheduledNotifications();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in process-scheduled-notifications:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
