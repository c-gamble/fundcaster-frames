import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {

    const supabaseURL = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
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