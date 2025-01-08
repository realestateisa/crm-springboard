import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import twilio from "npm:twilio@4.19.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { childCallSid, action, parentCallSid } = await req.json()
    
    const client = twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    );

    if (action === 'initiate') {
      console.log('Initiating transfer for child call:', childCallSid);
      
      // Create conference name using child call SID
      const conferenceName = `conf_${childCallSid}`;

      // 1. Put child call on hold
      await client.calls(childCallSid)
        .update({
          hold: true
        });

      const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
      if (!twilioNumber) {
        throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
      }

      // 2. Create new outbound call to transfer number and connect to conference
      const newCall = await client.calls
        .create({
          to: '+12106643493',
          from: twilioNumber,
          twiml: `<Response><Say>Connecting you to the conference.</Say><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false">${conferenceName}</Conference></Dial></Response>`
        });

      // 3. Update parent call to join conference
      await client.calls(parentCallSid)
        .update({
          twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false">${conferenceName}</Conference></Dial></Response>`
        });

      return new Response(
        JSON.stringify({ success: true, transferCallSid: newCall.sid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'complete') {
      console.log('Completing transfer for child call:', childCallSid);
      
      const conferenceName = `conf_${childCallSid}`;
      
      // 1. Take child off hold and connect to conference
      await client.calls(childCallSid)
        .update({
          hold: false,
          twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false">${conferenceName}</Conference></Dial></Response>`
        });

      // 2. Remove parent from call
      await client.calls(parentCallSid)
        .update({
          status: 'completed'
        });

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Transfer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});