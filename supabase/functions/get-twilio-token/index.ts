import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    // Get user from auth header
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser()

    if (error || !user) {
      throw new Error('Unauthorized')
    }

    // Import Twilio JWT helper
    const { default: twilio } = await import('npm:twilio')
    const AccessToken = twilio.jwt.AccessToken
    const VoiceGrant = AccessToken.VoiceGrant

    // Create an access token
    const token = new AccessToken(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_API_KEY')!,
      Deno.env.get('TWILIO_API_SECRET')!,
      { identity: user.id }
    )

    // Create a Voice grant and add it to the token
    const grant = new VoiceGrant({
      outgoingApplicationSid: Deno.env.get('TWILIO_TWIML_APP_SID'),
      incomingAllow: true,
    })
    token.addGrant(grant)

    // Create TwiML client
    const client = twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_AUTH_TOKEN')!
    )

    // Set up TwiML handler for outbound calls
    const twiml = new twilio.twiml.VoiceResponse()
    
    // Get the To parameter from the request if it exists
    const url = new URL(req.url)
    const to = url.searchParams.get('To')
    
    if (to) {
      // Make the outbound call and capture the child call
      const dial = twiml.dial({
        callerId: Deno.env.get('TWILIO_NUMBER'),
        record: 'record-from-answer',
      })
      dial.number(to)

      // Log the response for debugging
      console.log('TwiML Response:', twiml.toString())
      
      return new Response(twiml.toString(), {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/xml',
        },
        status: 200,
      })
    }

    // If no To parameter, return the token for client setup
    return new Response(
      JSON.stringify({ token: token.toJwt() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})