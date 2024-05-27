import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {

    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: 'Learn More',
                    action: 'link',
                    target: "https://warpcast.com/thesoftdao/0x6499dc93"
                },
                {
                    label: 'Begin →',
                    action: 'post',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=name`
                },
            ],
            image: {
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/home`,
            }
        })
    )

}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';