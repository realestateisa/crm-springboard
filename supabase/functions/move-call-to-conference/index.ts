import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from "npm:twilio@4.19.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { callSid, conferenceId } = await req.json()
    
    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') ?? '',
      Deno.env.get('TWILIO_AUTH_TOKEN') ?? ''
    );

    console.log(`Moving call ${callSid} to conference ${conferenceId}`);

    // Update the call to join the conference
    await client.calls(callSid).update({
      url: `https://handler.twilio.com/twiml/EH0123456789abcdef?conferenceId=${conferenceId}`,
      method: 'POST'
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error moving call to conference:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})