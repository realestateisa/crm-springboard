import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { VoiceResponse } from "npm:twilio/lib/twiml/VoiceResponse"
import twilio from "npm:twilio@4.19.0"

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
    
    console.log(`Moving call ${callSid} to conference ${conferenceId}`);

    if (!callSid) {
      throw new Error('CallSid is required');
    }

    if (!conferenceId) {
      throw new Error('ConferenceId is required');
    }

    const client = new twilio.Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') ?? '',
      Deno.env.get('TWILIO_AUTH_TOKEN') ?? ''
    );

    // Generate TwiML to move the call into a conference
    const twiml = new VoiceResponse();
    twiml.dial().conference({
      startConferenceOnEnter: 'false',
      endConferenceOnExit: 'true',
      waitUrl: 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical'
    }, conferenceId);

    // Update the call with the new TwiML
    await client.calls(callSid)
      .update({
        twiml: twiml.toString()
      });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error moving call to conference:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})