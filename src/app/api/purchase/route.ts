import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {

    const contractAddress = req.nextUrl.searchParams.get('contractAddress') || '';

    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: '← Back',
                    action: 'post',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/announce/${contractAddress}`,
                },
                {
                    label: 'Confirm',
                    action: 'tx',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/submitPurchase?contractAddress=${contractAddress}`,
                    postUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/afterPurchase`
                },
            ],
            image: {
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/purchase?contractAddress=${contractAddress}`,
            },
            input: {
                text: 'enter an amount to purchase'
            },
            state: {
                contractAddress: contractAddress
            }
        })
    )
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';