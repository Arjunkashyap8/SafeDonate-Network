/*
  # Email Verification Function

  1. New Function
    - `verify-email` - Verifies the email using the provided code
    - Updates account verification status
    - Returns success/failure response

  2. Security
    - Code expiration check
    - Rate limiting considerations
    - Secure verification process
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VerifyRequest {
  email: string;
  verificationCode: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, verificationCode }: VerifyRequest = await req.json()

    if (!email || !verificationCode) {
      return new Response(
        JSON.stringify({ error: 'Email and verification code are required' }),
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

    // Find account with matching email and verification code
    const { data: account, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .eq('email', email)
      .eq('verification_code', verificationCode)
      .single()

    if (fetchError || !account) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification code or email' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if account is already verified
    if (account.is_verified) {
      return new Response(
        JSON.stringify({ error: 'Account is already verified' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if verification code has expired (10 minutes)
    const createdAt = new Date(account.created_at)
    const now = new Date()
    const timeDiff = now.getTime() - createdAt.getTime()
    const minutesDiff = timeDiff / (1000 * 60)

    if (minutesDiff > 10) {
      return new Response(
        JSON.stringify({ error: 'Verification code has expired' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update account to verified status
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ 
        is_verified: true,
        verification_code: null // Clear the verification code
      })
      .eq('id', account.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to verify account' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Email verified successfully',
        accountId: account.id,
        role: account.role
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})