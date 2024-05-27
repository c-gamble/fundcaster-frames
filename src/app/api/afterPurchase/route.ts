import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateResponse = (token: any, success: boolean, transactionId: string) => {
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `← Back to ${token.tokenTicker}`,
                    action: 'post',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/launch/${token.contractAddress}`,
                },
                transactionId !== '' ? {
                    label: "View Transaction",
                    action: "link",
                    target: `https://basescan.org/tx/${transactionId}`
                } : {
                    label: 'Create a Token',
                    action: 'post',
                    target: "https://warpcast.com/thesoftdao/0x6499dc93"
                },
            ],
            image: {
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/afterPurchase?success=${success}&transactionId=${transactionId}&gradientStart=${token.gradientStart}&gradientEnd=${token.gradientEnd}`
            },
            state: {
                name: process.env.DEFAULT_TOKEN_NAME,
                ticker: process.env.DEFAULT_TOKEN_TICKER,
                logo: process.env.DEFAULT_TOKEN_LOGO,
                gradientStart: process.env.DEFAULT_GRADIENT_START,
                gradientEnd: process.env.DEFAULT_GRADIENT_END,
                description: process.env.DEFAULT_TOKEN_DESCRIPTION,
                supply: process.env.DEFAULT_INITIAL_SUPPLY,
            }
        })
    )
}

async function getResponse(req: NextRequest): Promise<NextResponse> {

    const body: FrameRequest = await req.json();
    const { transactionId } = body.untrustedData;
    const state = JSON.parse(decodeURIComponent(body.untrustedData.state));

    try {
        if (!state.contractAddress) {
            return generateResponse({}, false, '');
        }

        const supabaseURL = process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
        const supabase = createClient(supabaseURL, supabaseAnonKey);

        const { data, error } = await supabase.from('tokens').select('*').eq('contractAddress', state.contractAddress);

        if (error || !data) {
            return generateResponse({}, false, '');
        }

        const token = data[0];

        if (!transactionId) {
            return generateResponse(token, false, '');
        } else {
            return generateResponse(token, true, transactionId);
        }

    } catch (e: any) {
        return generateResponse({}, false, '');
    }

}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';