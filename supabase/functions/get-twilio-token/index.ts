import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { AccessToken } from "npm:twilio@4.19.0/lib/jwt/AccessToken"
import VoiceGrant from "npm:twilio@4.19.0/lib/jwt/AccessToken/VoiceGrant"

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

    // Check if this is a status callback from Twilio
    const url = new URL(req.url)
    if (url.pathname.includes('/status-callback')) {
      const formData = await req.formData()
      const parentCallSid = formData.get('ParentCallSid')
      const childCallSid = formData.get('CallSid')
      
      console.log('Status Callback:', {
        parentCallSid,
        childCallSid,
        status: formData.get('CallStatus')
      })

      // Store call data in Supabase
      if (parentCallSid && childCallSid) {
        await supabaseClient
          .from('calls')
          .upsert({
            external_id: parentCallSid,
            child_call_sid: childCallSid,
            status: formData.get('CallStatus'),
          })
      }

      return new Response('OK', { headers: corsHeaders })
    }

    // Handle TwiML generation for outbound calls
    if (url.pathname.includes('/generate-twiml')) {
      const { To } = await req.json()
      
      // Generate TwiML with status callback
      const statusCallbackUrl = `${url.origin}/get-twilio-token/status-callback`
      const twiml = new VoiceResponse()
      const dial = twiml.dial({
        callerId: Deno.env.get('TWILIO_NUMBER'),
        statusCallback: statusCallbackUrl,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      })
      dial.number(To)

      return new Response(twiml.toString(), { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/xml',
        }
      })
    }

    // Generate access token
    const accessToken = new AccessToken(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_API_KEY')!,
      Deno.env.get('TWILIO_API_SECRET')!,
      { identity: user.id }
    )

    const grant = new VoiceGrant({
      outgoingApplicationSid: Deno.env.get('TWILIO_TWIML_APP_SID'),
      incomingAllow: true,
    })
    accessToken.addGrant(grant)

    return new Response(
      JSON.stringify({ token: accessToken.toJwt() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})