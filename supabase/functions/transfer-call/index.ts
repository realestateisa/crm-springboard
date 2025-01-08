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

    // Check call status before proceeding
    const checkCallStatus = async (callSid: string) => {
      const call = await client.calls(callSid).fetch();
      if (call.status !== 'in-progress') {
        throw new Error(`Call ${callSid} is not in-progress (status: ${call.status}). Cannot proceed with operation.`);
      }
      return call;
    };

    if (action === 'initiate') {
      console.log('Initiating transfer for child call:', childCallSid);
      
      // Verify both calls are still active
      await checkCallStatus(childCallSid);
      await checkCallStatus(parentCallSid);
      
      const conferenceName = `conf_${childCallSid}`;
      const holdMusicUrl = "http://demo.twilio.com/docs/classic.mp3";

      // Put child call on hold with hold music
      await client.calls(childCallSid)
        .update({
          twiml: `<Response><Play loop="0">${holdMusicUrl}</Play></Response>`
        });

      const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
      if (!twilioNumber) {
        throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
      }

      // Create new outbound call to transfer number with endConferenceOnExit set to true
      const newCall = await client.calls
        .create({
          to: '+12106643493',
          from: twilioNumber,
          twiml: `<Response><Say>Connecting you to the conference.</Say><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="true" beep="false" waitUrl="${holdMusicUrl}">${conferenceName}</Conference></Dial></Response>`
        });

      // Connect parent call to conference with endConferenceOnExit set to true
      // This ensures if parent disconnects before completing transfer, child call is also disconnected
      await client.calls(parentCallSid)
        .update({
          twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="true" beep="false" waitUrl="">${conferenceName}</Conference></Dial></Response>`
        });

      return new Response(
        JSON.stringify({ success: true, transferCallSid: newCall.sid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'complete') {
      console.log('Completing transfer for child call:', childCallSid);
      
      // Verify calls are still active before completing transfer
      await checkCallStatus(childCallSid);
      await checkCallStatus(parentCallSid);
      
      const conferenceName = `conf_${childCallSid}`;
      const holdMusicUrl = "http://demo.twilio.com/docs/classic.mp3";
      
      // Get conference participants
      const conferences = await client.conferences
        .list({ friendlyName: conferenceName, status: 'in-progress' });

      if (conferences.length === 0) {
        throw new Error('Conference not found');
      }

      const conference = conferences[0];
      const participants = await client.conferences(conference.sid)
        .participants
        .list();

      // Only allow transfer if there are at least 2 participants
      if (participants.length < 2) {
        throw new Error('Cannot complete transfer: minimum 2 participants required');
      }

      // Take child off hold and connect to conference
      await client.calls(childCallSid)
        .update({
          twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false" beep="true" waitUrl="${holdMusicUrl}">${conferenceName}</Conference></Dial></Response>`
        });

      // Remove parent from call only if there are enough participants
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