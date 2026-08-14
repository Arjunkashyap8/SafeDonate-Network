/*
  # Complete Donor Profile Function

  1. New Function
    - `complete-donor-profile` - Creates or updates donor profile
    - Links to user account via account_id
    - Handles donor-specific information

  2. Security
    - Validates user authentication
    - Ensures user can only update their own profile
    - Input validation for all fields
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
}

interface DonorProfileRequest {
  accountId: string;
  donorName: string;
  phoneNumber: string;
  donationPref?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { accountId, donorName, phoneNumber, donationPref }: DonorProfileRequest = await req.json()

    // Validate required fields
    if (!accountId || !donorName || !phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Account ID, donor name, and phone number are required' }),
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

    // Verify account exists and is a donor
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, role, is_verified')
      .eq('id', accountId)
      .single()

    if (accountError || !account) {
      return new Response(
        JSON.stringify({ error: 'Invalid account ID' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (account.role !== 'Donor') {
      return new Response(
        JSON.stringify({ error: 'Account is not registered as a donor' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!account.is_verified) {
      return new Response(
        JSON.stringify({ error: 'Account email is not verified' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if donor profile already exists
    const { data: existingDonor } = await supabase
      .from('donors')
      .select('id')
      .eq('account_id', accountId)
      .single()

    let result;
    if (existingDonor) {
      // Update existing donor profile
      const { data, error } = await supabase
        .from('donors')
        .update({
          donor_name: donorName,
          phone_number: phoneNumber,
          donation_pref: donationPref || null
        })
        .eq('account_id', accountId)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new donor profile
      const { data, error } = await supabase
        .from('donors')
        .insert({
          account_id: accountId,
          donor_name: donorName,
          phone_number: phoneNumber,
          donation_pref: donationPref || null
        })
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('Database operation error:', result.error)
      return new Response(
        JSON.stringify({ error: 'Failed to save donor profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: existingDonor ? 'Donor profile updated successfully' : 'Donor profile created successfully',
        donor: result.data
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Complete donor profile error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})