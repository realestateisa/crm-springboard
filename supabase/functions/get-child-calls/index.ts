import { Twilio } from "npm:twilio@4.19.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { parentCallSid } = await req.json();
    
    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') || '',
      Deno.env.get('TWILIO_AUTH_TOKEN') || ''
    );

    const calls = await client.calls.list({ parentCallSid });
    console.log('Found child calls for parent:', parentCallSid, calls.map(c => c.sid));
    
    return new Response(JSON.stringify(calls), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-child-calls:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});