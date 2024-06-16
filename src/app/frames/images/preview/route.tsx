import { createPreview } from '@/utils/createPreview';

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

        const { searchParams } = new URL(request.url);
        return createPreview(JSON.parse(decodeURIComponent(searchParams.get('state') || '')));
        
    } catch (e: any) {
        console.log(e);
        return new Response(e.message, { status: 500 });
    }
};
