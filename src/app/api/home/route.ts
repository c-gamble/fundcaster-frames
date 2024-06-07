import { MongoClient, ServerApiVersion } from 'mongodb';

export async function GET(request: Request) {
    
    const dbClient = new MongoClient(process.env.MONGO_URI || '',  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );

    await dbClient.connect();
    const tokensDb = dbClient.db(process.env.MONGO_DB_NAME).collection('tokens');

    const result = await tokensDb.find({}).toArray();
    result.reverse();
    
    await dbClient.close();

    if (!result || result.length === 0) {
        return new Response(
            JSON.stringify({ error: 'database error' }),
            { status: 404 }
        );
    }
    console.log(`Found ${result.length} tokens`)
    return new Response(
        JSON.stringify(result),
        { status: 200 }
    );
}