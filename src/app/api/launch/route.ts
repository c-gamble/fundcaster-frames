import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';



async function getResponse(req: NextRequest): Promise<NextResponse> {

    const body: FrameRequest = await req.json();
    const state = JSON.parse(decodeURIComponent(body.untrustedData.state));
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: 'Start Sale 💰',
                    action: 'post',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=price`
                },
                {
                    label: 'Open Airdrop',
                    action: 'link',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/airdrop/${state.contractAddress}`
                },
            ],
            image: {
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/launch?gradientStart=${state.gradientStart}&gradientEnd=${state.gradientEnd}&ticker=${state.ticker}&passphrase=${state.passphrase}`,
            },
            state: state
        })
    )

}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';