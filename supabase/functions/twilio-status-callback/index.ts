import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const parentCallSid = formData.get('ParentCallSid')
    const callSid = formData.get('CallSid')
    const status = formData.get('CallStatus')

    console.log('Twilio Status Callback:', {
      parentCallSid,
      callSid,
      status,
    })

    // If this is a child call (has ParentCallSid) and it's just started
    if (parentCallSid && status === 'initiated') {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Update the call record with the child call SID
      const { error } = await supabaseAdmin
        .from('calls')
        .update({ child_call_sid: callSid })
        .eq('external_id', parentCallSid)

      if (error) {
        console.error('Error updating call record:', error)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error handling status callback:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})