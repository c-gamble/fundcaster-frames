import { MongoClient, ServerApiVersion } from 'mongodb';

export async function POST(request: Request) {

    try {
        const body = await request.json();
        const { walletAddress, passphrase, contractAddress } = body;

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
        if (!result || result.length === 0) {
            await dbClient.close();
            return new Response(JSON.stringify({ success: false }), { status: 200 });
        }

        const data = result.filter(token => token.contractAddress.toLowerCase() == contractAddress.toLowerCase());
        if (!data || data.length == 0) {
            await dbClient.close();
            return new Response(JSON.stringify({ success: false }), { status: 200 });
        }

        const token = data[0];
        if (!token.userAddress == walletAddress.toLowerCase() && token.passphrase == passphrase) {
            await dbClient.close();
            return new Response(JSON.stringify({ success: false }), { status: 200 });
        }
        
        await dbClient.close();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
        
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ success: false }), { status: 200 });
    }
}