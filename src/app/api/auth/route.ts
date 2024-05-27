import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {

    try {
        const body = await request.json();
        const { walletAddress, passphrase, contractAddress } = body;

        const supabaseURL = process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
        const supabase = createClient(supabaseURL, supabaseAnonKey);

        const { data, error } = await supabase.from('tokens').select('*').eq('contractAddress', contractAddress);

        if (error || !data || data.length == 0) {
            console.log(error, data);
            return new Response(JSON.stringify({ success: false }), { status: 200 });
        }

        const token = data[0];
        if (!token.userAddress == walletAddress.toLowerCase()) {
            return new Response(JSON.stringify({ success: false }), { status: 200 });
        }
        const match = await bcrypt.compare(passphrase, token.authHash);

        if (match) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false }), { status: 200 });
        }
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ success: false }), { status: 200 });
    }
}