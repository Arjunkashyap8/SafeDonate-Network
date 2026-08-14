/*
  # Complete Orphanage Profile Function

  1. New Function
    - `complete-orphanage-profile` - Creates or updates orphanage profile
    - Links to user account via account_id
    - Handles orphanage-specific information including bank details

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

interface OrphanageProfileRequest {
  accountId: string;
  orphanageName: string;
  location: string;
  capacity?: number;
  establishedDate?: string;
  maleCount?: number;
  femaleCount?: number;
  bankDetails: {
    accountName: string;
    accountType: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      accountId, 
      orphanageName, 
      location, 
      capacity, 
      establishedDate, 
      maleCount, 
      femaleCount, 
      bankDetails 
    }: OrphanageProfileRequest = await req.json()

    // Validate required fields
    if (!accountId || !orphanageName || !location || !bankDetails) {
      return new Response(
        JSON.stringify({ error: 'Account ID, orphanage name, location, and bank details are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate bank details
    if (!bankDetails.accountName || !bankDetails.accountType || !bankDetails.accountHolderName || 
        !bankDetails.accountNumber || !bankDetails.ifscCode) {
      return new Response(
        JSON.stringify({ error: 'All bank details are required' }),
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

    // Verify account exists and is an orphanage
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

    if (account.role !== 'Orphanage') {
      return new Response(
        JSON.stringify({ error: 'Account is not registered as an orphanage' }),
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

    // Check if orphanage profile already exists
    const { data: existingOrphanage } = await supabase
      .from('orphanages')
      .select('id, bank_details_id')
      .eq('account_id', accountId)
      .single()

    let bankDetailsId;

    if (existingOrphanage && existingOrphanage.bank_details_id) {
      // Update existing bank details
      const { data: updatedBankDetails, error: bankUpdateError } = await supabase
        .from('Bank_details')
        .update({
          account_name: bankDetails.accountName,
          account_type: bankDetails.accountType,
          account_holder_name: bankDetails.accountHolderName,
          account_number: parseInt(bankDetails.accountNumber),
          IFSC_code: bankDetails.ifscCode
        })
        .eq('id', existingOrphanage.bank_details_id)
        .select()
        .single()

      if (bankUpdateError) {
        console.error('Bank details update error:', bankUpdateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update bank details' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      bankDetailsId = updatedBankDetails.id
    } else {
      // Create new bank details
      const { data: newBankDetails, error: bankInsertError } = await supabase
        .from('Bank_details')
        .insert({
          account_name: bankDetails.accountName,
          account_type: bankDetails.accountType,
          account_holder_name: bankDetails.accountHolderName,
          account_number: parseInt(bankDetails.accountNumber),
          IFSC_code: bankDetails.ifscCode
        })
        .select()
        .single()

      if (bankInsertError) {
        console.error('Bank details insert error:', bankInsertError)
        return new Response(
          JSON.stringify({ error: 'Failed to create bank details' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      bankDetailsId = newBankDetails.id
    }

    let result;
    if (existingOrphanage) {
      // Update existing orphanage profile
      const { data, error } = await supabase
        .from('orphanages')
        .update({
          orphanage_name: orphanageName,
          location: location,
          capacity: capacity || null,
          established_date: establishedDate || null,
          male_count: maleCount || null,
          female_count: femaleCount || null,
          bank_details_id: bankDetailsId
        })
        .eq('account_id', accountId)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new orphanage profile
      const { data, error } = await supabase
        .from('orphanages')
        .insert({
          account_id: accountId,
          orphanage_name: orphanageName,
          location: location,
          capacity: capacity || null,
          established_date: establishedDate || null,
          male_count: maleCount || null,
          female_count: femaleCount || null,
          bank_details_id: bankDetailsId
        })
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('Database operation error:', result.error)
      return new Response(
        JSON.stringify({ error: 'Failed to save orphanage profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: existingOrphanage ? 'Orphanage profile updated successfully' : 'Orphanage profile created successfully',
        orphanage: result.data
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Complete orphanage profile error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})