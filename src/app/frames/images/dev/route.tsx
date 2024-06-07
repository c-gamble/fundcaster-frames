import { ImageResponse } from 'next/og';

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
                <div style={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'flex-start', paddingLeft: '60px', justifyContent: 'center', flexDirection: 'column', backgroundImage: 'url(https://soft-pump-assets.s3.amazonaws.com/background.jpg)'}}>
                    <h1 style={{textAlign: 'center', fontSize: '80px', margin: '0px', color: 'white'}}>dev landing page</h1>
                    <p style={{textAlign: 'center', color: 'white', fontSize: '30px'}}>click "go" to be directed to your desired frame</p>
                    <div style={{position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                        <img src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" style={{ height: '50px' }} alt="SOFT logo" />
                    </div>
                </div>
            ),
            {
                fonts: fonts,
                width: 1200,
                height: 630
            },
        )
        
    } catch (e: any) {
        console.log(e);
        return new Response(e.message, { status: 500 });
    }
};