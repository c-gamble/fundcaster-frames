import { ImageResponse } from 'next/og'

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
        const successString = url.searchParams.get('success') || 'false';
        const success = (successString === 'true') as boolean;
        console.log(successString, success)
        const contractAddress = url.searchParams.get('contractAddress') || '';
        const gradientStart = url.searchParams.get('gradientStart') || '014bad';
        const gradientEnd = url.searchParams.get('gradientEnd') || '17101F';
        const passphrase = url.searchParams.get('passphrase') || '';

        return new ImageResponse(
            (
                <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'flex-start', paddingLeft: '60px', justifyContent: 'center', flexDirection: 'column', backgroundImage: `linear-gradient(to right, #${success ? gradientStart : '014bad'}, #${success ? gradientEnd : '17101F'})` }}>
                    <h1 style={{ textAlign: 'center', fontSize: '80px', margin: '0px', color: 'white' }}>{success ? "token created!" : "please try again!"}</h1>
                    <p style={{ textAlign: 'center', color: 'white', fontSize: '30px' }}>{success ? `contract available at ${contractAddress}` : "or contact SOFT for assistance"}</p>
                    {
                        success && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', marginTop: '20px' }}>
                                <h2 style={{ textAlign: 'center', color: 'white', fontSize: '30px', margin: '0px' }}>store your passphrase for access to additional tooling</h2>
                                <p style={{ textAlign: 'center', color: 'white', fontSize: '30px' }}>passphrase: {passphrase}</p>
                            </div>
                        )
                    }
                    <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                        <img src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" style={{ height: '50px' }} alt="SOFT logo" />
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