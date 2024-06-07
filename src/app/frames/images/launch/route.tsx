import { ImageResponse } from 'next/og';
import Image from 'next/image';
import { getTextColor } from '@/utils/textColor';

export const runtime = 'edge';

export async function GET(request: Request) {

    try {

        const regularFontData = fetch(new URL('https://soft-pump-assets.s3.amazonaws.com/Montserrat/static/Montserrat-Regular.ttf')).then((res) => res.arrayBuffer());
        const boldFontData = fetch(new URL('https://soft-pump-assets.s3.amazonaws.com/Montserrat/static/Montserrat-Bold.ttf')).then((res) => res.arrayBuffer());

        const regularFont = await Promise.all([regularFontData]);
        const boldFont = await Promise.all([boldFontData]);

        const fonts: any = [
            {
                name: 'Montserrat',
                data: regularFont[0],
                weight: 400
            },
            {
                name: 'Montserrat',
                data: boldFont[0],
                weight: 700
            }
        ]

        const url = new URL(request.url);
        const gradientStart = url.searchParams.get('gradientStart') || '014bad';
        const gradientEnd = url.searchParams.get('gradientEnd') || '17101F';
        const ticker = url.searchParams.get('ticker') || '';
        const passphrase = url.searchParams.get('passphrase') || '';
        const textColor = getTextColor(gradientStart, gradientEnd);

        return new ImageResponse(
            (
                <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'flex-start', paddingLeft: '60px', justifyContent: 'center', flexDirection: 'column', backgroundImage: `linear-gradient(to right, #${gradientStart}, #${gradientEnd})`, color: textColor }}>
                    <h1 style={{ textAlign: 'center', fontSize: '80px', margin: '0px' }}>ready to launch {ticker}?</h1>
                    <p style={{ textAlign: 'center', fontSize: '30px' }}>start a sale or open an airdrop now</p>      
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', marginTop: '30px' }}>
                            <h2 style={{ textAlign: 'center', fontSize: '30px', margin: '0px', fontWeight: '700' }}>store your passphrase to use SOFT&#39;s tooling:</h2>
                            <p style={{ textAlign: 'center', fontSize: '30px', fontWeight: '700' }}>{passphrase}</p>
                        </div>
                    <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                        <Image src={"https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"} height={50} width={50} alt="SOFT logo" />
                    </div>
                </div>
            ),
            {
                fonts: fonts,
                width: 1200,
                height: 630
            }
        )

    } catch (e: any) {
        console.log(e);
        return new Response(e.message, { status: 500 });
    }
};