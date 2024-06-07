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

        return new ImageResponse(
            (
                <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'flex-start', paddingLeft: '60px', justifyContent: 'center', flexDirection: 'column', backgroundImage: `linear-gradient(to right, #014bad, #17101F)`, color: 'white' }}>
                    <h1 style={{ textAlign: 'center', fontSize: '80px', margin: '0px' }}>please try again!</h1>
                    <p style={{ textAlign: 'center', fontSize: '30px' }}>or contact SOFT for assistance</p>
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