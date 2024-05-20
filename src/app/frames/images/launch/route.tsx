import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

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

        const supabaseURL = process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
        const supabase = createClient(supabaseURL, supabaseAnonKey);
        
        const { data, error } = await supabase.from('tokens').select('*').eq('contractAddress', contractAddress);
        if (error || !data || data.length == 0) {
            console.log(error, data);
            return new ImageResponse(
                (
                    <div style={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundImage: 'linear-gradient(to right, #014bad, #17101F)'}}>
                        <h1 style={{color: 'white', fontSize: '60px', margin: '0px', fontWeight: 700}}>token not found</h1>
                        <div style={{position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '20px'}}>
                            <p style={{color: 'white', fontSize: '20px', margin: '0px'}}>created with fundcaster by SOFT</p>
                        </div>
                    </div>
                )
            );
        }
        

        const token = data[0];

        return new ImageResponse(
            (
                <div style={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundImage: 'linear-gradient(to right, #014bad, #17101F)'}}>
                    <div style={{display: 'flex', height: '20%', width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '30px'}}>
                        <h1 style={{color: 'white', fontSize: '60px', margin: '0px', fontWeight: 700}}>token launch</h1>
                    </div>
                    
                    <div style={{display: 'flex', height: '80%', width: '100%', paddingLeft: '60px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                
                        <div style={{display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-start', height: '100%', justifyContent: 'space-around'}}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <p style={{textAlign: 'center', color: 'white', fontSize: '26px', margin: '0px', marginBottom: '10px'}}>name</p>  
                                <h1 style={{textAlign: 'center', fontSize: '40px', margin: '0px', color: 'white', fontWeight: 700}}>{token.tokenName}</h1>
                            </div>
                            
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <p style={{textAlign: 'center', color: 'white', fontSize: '26px', margin: '0px', marginBottom: '10px'}}>ticker</p>  
                                <h1 style={{textAlign: 'center', fontSize: '40px', margin: '0px', color: 'white'}}>{token.tokenTicker}</h1>
                            </div>
                    
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <p style={{textAlign: 'center', color: 'white', fontSize: '26px', margin: '0px', marginBottom: '10px'}}>description</p>  
                                <h1 style={{textAlign: 'center', fontSize: '40px', margin: '0px', color: 'white'}}>{token.description}</h1>
                            </div>           
                        </div>        
                
                        <div style={{position: 'absolute', display: 'flex', bottom: '30%', right: '10%', backgroundColor: 'white', borderRadius: '50%', padding: '40px'}}>
                            <img src={token.imageURL} style={{height: '200px'}} alt="token logo" />
                        </div>  

                    </div>
                    <div style={{position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '20px'}}>
                    <p style={{color: 'white', fontSize: '20px', margin: '0px'}}>created with fundcaster by SOFT</p>
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