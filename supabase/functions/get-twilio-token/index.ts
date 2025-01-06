import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { AccessToken } from 'https://esm.sh/twilio@4.19.0/lib/jwt/AccessToken'
import { VoiceGrant } from 'https://esm.sh/twilio@4.19.0/lib/jwt/AccessToken'

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

    // Create an access token
    const accessToken = new AccessToken(
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
    accessToken.addGrant(grant)

    // Generate the token
    const token = accessToken.toJwt()

    return new Response(
      JSON.stringify({ token }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})