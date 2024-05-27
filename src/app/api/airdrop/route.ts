import { createClient } from '@supabase/supabase-js';
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ABI } from '@/constants/tokenABI';
import { transfer } from "thirdweb/extensions/erc20";

export async function POST(req: Request) {

    try {

        const body = await req.json();
        const {
            contractAddress,
            csvData,
            customNow,
            customDelay,
            followers,
            defaultNow,
            defaultDelay,
            warpcastUsername
        } = body;

        const supabaseURL = process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || '';
        const supabase = createClient(supabaseURL, supabaseAnonKey);

        let walletAllocations: any = {};
        if (customNow || customDelay) {
            for (let i = 1; i < csvData.length; i++) {
                const row = csvData[i];
                const wallet = row.address;
                const allocation = BigInt(row.allocation) * BigInt(10 ** 18);
                walletAllocations[wallet] = allocation;
            }

            if (customNow) {
                const client = createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID || '', secretKey: process.env.THIRDWEB_SECRET_KEY || '' } as any);
                const chainId = (process.env.CHAIN_ID || '') as any;
                console.log(chainId);
                const contract = getContract({
                    client,
                    chain: defineChain(8453),
                    address: contractAddress,
                    abi: ABI as any
                });
                const tx = await transfer({
                    contract,
                    to: Object.keys(walletAllocations)[0] as string,
                    amount: Object.values(walletAllocations)[0] as string
                });

                console.log(tx);

            }

        } else if (defaultNow) {
            // const followers = await getFollowers(warpcastUsername);
        }

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

    } catch (e: any) {
        console.log(e);
        return new Response(JSON.stringify({ success: false }), { status: 500 });
    }
};