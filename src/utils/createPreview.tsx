import { ImageResponse } from 'next/og';
import { getTextColor } from './textColor';

export const runtime = 'edge';

export const createPreview = async (state: any) => {

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
                <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'flex-start', paddingLeft: '60px', justifyContent: 'center', flexDirection: 'column', backgroundImage: `linear-gradient(to right, #${state.gradientStart}, #${state.gradientEnd})`, color: getTextColor(state.gradientStart, state.gradientEnd) }}>

                    <h1 style={{ textAlign: 'center', fontSize: '80px', margin: '0px' }}>review details</h1>
                    <p style={{ textAlign: 'center', fontSize: '30px' }}>name: {state.name}</p>
                    <p style={{ textAlign: 'center', fontSize: '30px' }}>ticker: {state.ticker}</p>
                    <p style={{ textAlign: 'center', fontSize: '30px' }}>description: {state.description.length > 30 ? `${state.description.substring(0, 30)}...` : state.description}</p>
                    <p style={{ textAlign: 'center', fontSize: '30px' }}>initial supply: {`${BigInt(state.supply).toLocaleString()}`}</p>

                    <div style={{ position: 'absolute', display: 'flex', bottom: '30%', right: '20%', backgroundColor: 'white', borderRadius: '50%', padding: '20px' }}>
                        {state.logo && <img src={state.logo} style={{ height: '100px' }} alt="token logo" />}
                    </div>

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
        return new Response(e.message, { status: 500 });
    }
};
