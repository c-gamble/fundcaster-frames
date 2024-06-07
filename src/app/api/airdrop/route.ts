import { MongoClient, ServerApiVersion } from 'mongodb';
import { ABI } from '@/constants/tokenABI';

export async function GET(request: Request) {

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
    const tokensDb = dbClient.db(process.env.MONGO_DB_NAME).collection('tokens');

    const result = await tokensDb.find({ contractAddress: contractAddress }).toArray();
    await dbClient.close();

    if (!result || result.length === 0) {
        return new Response('Not found', { status: 404 });
    }

    return new Response(JSON.stringify(result[0]), { status: 200 });
}

export async function POST(req: Request) {

    return new Response(JSON.stringify({ success: false }), { status: 500 });

    // try {

    //     const body = await req.json();
    //     const {
    //         contractAddress,
    //         csvData,
    //         customNow,
    //         customDelay,
    //         followers,
    //         defaultNow,
    //         defaultDelay,
    //         warpcastUsername
    //     } = body;

        // const dbClient = new MongoClient(process.env.MONGO_URI || '',  {
        //         serverApi: {
        //             version: ServerApiVersion.v1,
        //             strict: true,
        //             deprecationErrors: true,
        //         }
        //     }
        // );

        // await dbClient.connect();
        // // write query
        // await dbClient.close();

    //     let walletAllocations: any = {};
    //     if (customNow || customDelay) {
    //         for (let i = 1; i < csvData.length; i++) {
    //             const row = csvData[i];
    //             const wallet = row.address;
    //             const allocation = BigInt(row.allocation) * BigInt(10 ** 18);
    //             walletAllocations[wallet] = allocation;
    //         }

    //         if (customNow) {
    //             const client = createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID || '', secretKey: process.env.THIRDWEB_SECRET_KEY || '' } as any);
    //             const chainId = (process.env.CHAIN_ID || '') as any;
    //             console.log(chainId);
    //             const contract = getContract({
    //                 client,
    //                 chain: defineChain(8453),
    //                 address: contractAddress,
    //                 abi: ABI as any
    //             });
    //             const tx = await transfer({
    //                 contract,
    //                 to: Object.keys(walletAllocations)[0] as string,
    //                 amount: Object.values(walletAllocations)[0] as string
    //             });

    //             console.log(tx);

    //         }

    //     } else if (defaultNow) {
    //         // const followers = await getFollowers(warpcastUsername);
    //     }

    // const { data, error } = await supabase
    //     .from('airdrops')
    //     .insert([
    //         {
    //             contractAddress,
    //             walletAllocations,
    //             customNow,
    //             customDelay,
    //             followers,
    //             defaultNow,
    //             defaultDelay,
    //             warpcastUsername
    //         }
    //     ]);

    // } catch (e: any) {
    //     console.log(e);
    //     return new Response(JSON.stringify({ success: false }), { status: 500 });
    // }
};