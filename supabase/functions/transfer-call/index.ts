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

    const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    if (!twilioNumber) {
      throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
    }

    if (action === 'initiate') {
      console.log('Initiating transfer for child call:', childCallSid);
      
      // Create conference name using child call SID
      const conferenceName = `conf_${childCallSid}`;

      try {
        // 1. Put child call on hold and connect to conference
        await client.calls(childCallSid)
          .update({
            hold: true,
            twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false" beep="false" waitUrl="http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical">${conferenceName}</Conference></Dial></Response>`
          });

        console.log('Child call updated successfully');

        // 2. Create new outbound call to transfer number
        const newCall = await client.calls
          .create({
            to: '+12106643493',
            from: twilioNumber,
            twiml: `<Response><Say>Connecting you to the conference.</Say><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false" beep="false">${conferenceName}</Conference></Dial></Response>`,
            statusCallback: `https://${req.headers.get('host')}/transfer-status`,
            statusCallbackEvent: ['completed'],
            statusCallbackMethod: 'POST'
          });

        console.log('Transfer call created successfully:', newCall.sid);

        // 3. Connect parent call to conference
        await client.calls(parentCallSid)
          .update({
            twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false" beep="false">${conferenceName}</Conference></Dial></Response>`
          });

        console.log('Parent call updated successfully');

        return new Response(
          JSON.stringify({ success: true, transferCallSid: newCall.sid }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (twilioError) {
        console.error('Twilio API error:', twilioError);
        throw new Error(`Twilio API error: ${twilioError.message}`);
      }

    } else if (action === 'complete') {
      console.log('Completing transfer for child call:', childCallSid);
      
      const conferenceName = `conf_${childCallSid}`;
      
      try {
        // 1. Take child off hold and keep in conference
        await client.calls(childCallSid)
          .update({
            hold: false,
            twiml: `<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="false" beep="false">${conferenceName}</Conference></Dial></Response>`
          });

        console.log('Child call taken off hold');

        // 2. Remove parent from call
        await client.calls(parentCallSid)
          .update({
            status: 'completed'
          });

        console.log('Parent call completed');

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (twilioError) {
        console.error('Twilio API error:', twilioError);
        throw new Error(`Twilio API error: ${twilioError.message}`);
      }
    }

    throw new Error('Invalid action specified');

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
