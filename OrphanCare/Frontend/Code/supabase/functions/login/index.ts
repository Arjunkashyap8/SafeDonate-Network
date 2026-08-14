/*
  # User Login Function

  1. New Function
    - `login` - Handles user login with email/password
    - Validates credentials against accounts table
    - Returns user session information

  2. Security
    - Password verification
    - Account verification check
    - Secure session handling
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface LoginRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, password }: LoginRequest = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Hash the provided password to compare
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Find account with matching email and password
    const { data: account, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .eq('email', email)
      .eq('password', hashedPassword)
      .single()

    if (fetchError || !account) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if account is verified
    if (!account.is_verified) {
      return new Response(
        JSON.stringify({ error: 'Please verify your email before logging in' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a simple session token (in production, use JWT or similar)
    const sessionToken = crypto.randomUUID()

    // Update last login time
    await supabase
      .from('accounts')
      .update({ last_login: new Date().toISOString() })
      .eq('id', account.id)

    return new Response(
      JSON.stringify({ 
        message: 'Login successful',
        user: {
          id: account.id,
          email: account.email,
          role: account.role,
          isVerified: account.is_verified
        },
        sessionToken
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})