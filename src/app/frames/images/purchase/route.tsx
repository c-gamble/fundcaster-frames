import { ImageResponse } from 'next/og';
import { MongoClient, ServerApiVersion } from 'mongodb';

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
        const contractAddress = url.searchParams.get('contractAddress') || '';

        const dbClient = new MongoClient(process.env.MONGO_URI || '',  {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            }
        );

        await dbClient.connect();
        
        const { data, error } = await supabase.from('tokens').select('*').eq('contractAddress', contractAddress);

        await dbClient.close();

        if (error || !data || data.length == 0) {
            console.log(error, data);
            return new ImageResponse(
                (
                    <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundImage: 'linear-gradient(to right, #014bad, #17101F)' }}>
                        <h1 style={{ color: 'white', fontSize: '60px', margin: '0px', fontWeight: 700 }}>token not found</h1>
                        <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '20px' }}>
                            <p style={{ color: 'white', fontSize: '20px', margin: '0px' }}>created with fundcaster by SOFT</p>
                        </div>
                    </div>
                )
            );
        }


        const token = data[0];

        return new ImageResponse(
            (
                <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'flex-start', paddingLeft: '60px', justifyContent: 'center', flexDirection: 'column', backgroundImage: `linear-gradient(to right, #${token.gradientStart}, #${token.gradientEnd})` }}>
                    <h1 style={{ textAlign: 'center', fontSize: '80px', margin: '0px', color: 'white' }}>buy {token.tokenTicker.toUpperCase()}</h1>
                    <p style={{ textAlign: 'center', color: 'white', fontSize: '30px' }}>enter an amount below (total supply is {token.initialSupply.toLocaleString()})</p>
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