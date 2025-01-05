import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const userData = await req.json()
    console.log('Received user data:', userData)

    // Create the user in auth.users
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: Math.random().toString(36).slice(-8), // Generate random password
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    })

    if (createUserError) {
      console.error('Error creating user:', createUserError)
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update the profile with additional information
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        is_active: true,
      })
      .eq('id', authUser.user.id)

    if (updateProfileError) {
      console.error('Error updating profile:', updateProfileError)
      return new Response(
        JSON.stringify({ error: updateProfileError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send password reset email to the new user
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: userData.email,
    })

    if (resetError) {
      console.error('Error sending password reset email:', resetError)
      // We don't return an error here as the user was created successfully
      // Just log it for debugging
    }

    return new Response(
      JSON.stringify({ id: authUser.user.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in create-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})