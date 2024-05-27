import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {

    const body = await request.json();
    const { supabaseURL, supabaseAnonKey } = body;
    const supabase = createClient(supabaseURL, supabaseAnonKey);

    const { data, error } = await supabase.from('tokens').select('*');

    if (error || !data) {
        console.log(error, data);
        return new Response(
            JSON.stringify({ error: 'database error' }),
            { status: 404 }
        );
    }

    console.log(`Found ${data.length} tokens`)
    return new Response(
        JSON.stringify(data),
        { status: 200 }
    );
}