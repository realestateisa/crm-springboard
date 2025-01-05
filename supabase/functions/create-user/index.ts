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
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const userData = await req.json()
    console.log('Received user data:', userData)

    // First check auth.users table using admin API
    const { data: existingAuthUsers, error: authCheckError } = await supabase.auth.admin.listUsers()
    
    if (authCheckError) {
      console.error('Error checking auth users:', authCheckError)
      return new Response(
        JSON.stringify({ error: 'Failed to check existing users' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Checking auth.users table for email:', userData.email)
    const emailExists = existingAuthUsers.users.some(user => user.email === userData.email)
    console.log('Email exists in auth.users?', emailExists)

    if (emailExists) {
      console.error('Email already exists in auth.users:', userData.email)
      return new Response(
        JSON.stringify({ error: 'A user with this email address has already been registered' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Also check profiles table
    const { data: existingProfiles, error: profileCheckError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
    
    if (profileCheckError) {
      console.error('Error checking profiles:', profileCheckError)
      return new Response(
        JSON.stringify({ error: 'Failed to check existing profiles' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Checking profiles table for email:', userData.email)
    console.log('Existing profiles with this email:', existingProfiles)

    if (existingProfiles && existingProfiles.length > 0) {
      console.error('Email already exists in profiles:', userData.email)
      return new Response(
        JSON.stringify({ error: 'A user with this email address already exists in profiles' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create the user in auth.users with a random password
    const tempPassword = Math.random().toString(36).slice(-12)
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
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
      // If profile update fails, clean up by deleting the auth user
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return new Response(
        JSON.stringify({ error: updateProfileError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: userData.email,
      newEmail: userData.email,
    })

    if (resetError) {
      console.error('Error generating password reset link:', resetError)
      return new Response(
        JSON.stringify({ error: resetError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send welcome email with password reset link using Resend
    if (RESEND_API_KEY) {
      try {
        console.log('Sending welcome email to:', userData.email)
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'ISA/ONE <onboarding@resend.dev>',
            to: [userData.email],
            subject: 'Welcome to ISA/ONE - Set Up Your Password',
            html: `
              <h1>Welcome to ISA/ONE!</h1>
              <p>Hello ${userData.first_name},</p>
              <p>Your account has been created. To get started, please set up your password by clicking the link below:</p>
              <p><a href="${resetData.properties.action_link}">Set Your Password</a></p>
              <p>If you didn't request this account, please ignore this email.</p>
              <p>Best regards,<br>The ISA/ONE Team</p>
            `,
          }),
        })

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text()
          console.error('Error sending welcome email:', emailError)
          // Don't return error as user is created successfully
        } else {
          console.log('Welcome email sent successfully')
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
        // Don't return error as user is created successfully
      }
    } else {
      console.warn('RESEND_API_KEY not found, skipping welcome email')
    }

    return new Response(
      JSON.stringify({ 
        id: authUser.user.id,
        message: 'User created successfully. A password reset email has been sent.'
      }),
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