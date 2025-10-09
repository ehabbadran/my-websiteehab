import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SubscribeRequest {
  email: string;
  source?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, source = 'unknown' }: SubscribeRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const kitApiSecret = Deno.env.get('KIT_API_SECRET');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let kitSubscriberId = null;
    let subscriptionStatus = 'active';

    if (kitApiSecret) {
      try {
        const kitResponse = await fetch(
          'https://api.convertkit.com/v3/subscribers',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_secret: kitApiSecret,
              email: email,
            }),
          }
        );

        if (kitResponse.ok) {
          const kitData = await kitResponse.json();
          kitSubscriberId = kitData.subscriber?.id || null;
        } else {
          const errorText = await kitResponse.text();
          console.error('Kit API error:', errorText);
          subscriptionStatus = 'failed';
        }
      } catch (kitError) {
        console.error('Error calling Kit API:', kitError);
        subscriptionStatus = 'failed';
      }
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          kit_subscriber_id: kitSubscriberId,
          status: subscriptionStatus,
          source: source,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save subscription' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: subscriptionStatus === 'active' 
          ? 'Successfully subscribed to newsletter!' 
          : 'Subscription saved, but Kit API failed. Please contact support.',
        subscriber: data,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});