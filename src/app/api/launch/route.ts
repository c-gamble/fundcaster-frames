import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {

    const url = new URL(request.url);
    const contractAddress = url.searchParams.get('contractAddress') || '';

    const supabaseURL = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
    const supabase = createClient(supabaseURL, supabaseAnonKey);

    const { data, error } = await supabase.from('tokens').select('*').eq('contractAddress', contractAddress);
    if (error || !data || data.length == 0) {
        return new Response('Not found', { status: 404 });
    } else {
        return new Response(JSON.stringify(data[0]), {
            headers: {
                'content-type': 'application/json',
            },
        });
    }
}