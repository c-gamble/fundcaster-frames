import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateResponse = (state: any, success: boolean, contractAddress: string, passphrase: string) => {
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `Launch ${state.ticker}`,
                    action: 'link',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/launch/${contractAddress}`,
                },
                {
                    label: 'Restart',
                    action: 'post',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/restart`,
                },
                {
                    label: "View on Chain",
                    action: "link",
                    target: `https://basescan.org/token/${contractAddress}`
                }
            ],
            image: {
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/end?success=${success}&contractAddress=${contractAddress}&gradientStart=${state.gradientStart}&gradientEnd=${state.gradientEnd}&passphrase=${passphrase}`
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

    let contractAddress = "";
    let success = false;

    try {

        await delay(3000);

        const response = await axios.get(`https://api${process.env.CHAIN_ID == "84532" ? "-sepolia" : ""}.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=${transactionId}&apikey=${process.env.BASE_SCAN_API_KEY}`)
        console.log(response)
        contractAddress = response.data.result.logs[0].address;
        const userAddress = response.data.result.from;

        const supabaseURL = process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
        const supabase = createClient(supabaseURL, supabaseAnonKey);

        const existingToken = await supabase.from('tokens').select('contractAddress').eq('contractAddress', contractAddress);
        if (existingToken.data && existingToken.data.length > 0) {
            success = false;
            return generateResponse(state, success, contractAddress, "");
        }

        const passphrase = crypto.randomBytes(5).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passphrase, salt);


        const { data, error } = await supabase.from('tokens').insert({
            tokenName: state.name,
            tokenTicker: state.ticker,
            imageURL: state.logo,
            gradientStart: state.gradientStart,
            gradientEnd: state.gradientEnd,
            description: state.description,
            contractAddress: contractAddress,
            initialSupply: state.supply,
            userAddress: userAddress,
            txHash: transactionId,
            chainId: process.env.CHAIN_ID,
            authHash: hashedPassword
        });

        if (error) {
            console.log(error);
            success = false;
            return generateResponse(state, success, contractAddress, "");
        } else {
            success = true;
            return generateResponse(state, success, contractAddress, passphrase);
        }

    } catch (e: any) {
        console.log(e);
        success = false;
        return generateResponse(state, success, contractAddress, "");
    }

}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';