import { MongoClient, ServerApiVersion } from 'mongodb';

export async function POST(request: Request) {

    const body = await request.json();
    const { mongoURI } = body;

    const dbClient = new MongoClient(mongoURI|| '',  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );

    await dbClient.connect();
    
    const { data, error } = await supabase.from('tokens').select('*');
    
    await dbClient.close();

    

    if (error || !data) {
        console.log(error, data);
        return new Response(
            JSON.stringify({ error: 'database error' }),
            { status: 404 }
        );
    }

    console.log(`Found ${data.length} tokens`)
    return new Response(
        JSON.stringify(data),
        { status: 200 }
    );
}