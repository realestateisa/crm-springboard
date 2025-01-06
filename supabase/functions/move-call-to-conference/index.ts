import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio@4.19.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    const { parentCallSid, childCallSid, conferenceId } = await req.json()
    
    console.log(`Moving calls to conference ${conferenceId}:`, { parentCallSid, childCallSid });

    if (!parentCallSid || !childCallSid || !conferenceId) {
      throw new Error('CallSids and ConferenceId are required');
    }

    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') ?? '',
      Deno.env.get('TWILIO_AUTH_TOKEN') ?? ''
    );

    // Generate TwiML for both calls
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.dial().conference({
      startConferenceOnEnter: 'true',
      endConferenceOnExit: 'false',
      waitUrl: 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical'
    }, conferenceId);

    console.log('Generated TwiML:', twiml.toString());

    // Move both calls to conference
    const moveParentCall = client.calls(parentCallSid)
      .update({
        twiml: twiml.toString()
      });

    const moveChildCall = client.calls(childCallSid)
      .update({
        twiml: twiml.toString()
      });

    await Promise.all([moveParentCall, moveChildCall]);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error moving calls to conference:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})