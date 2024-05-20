import { encodeFunctionData, parseEther } from 'viem';
import { FrameRequest, FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { ABI } from "@/constants/abi";

async function getResponse(req: NextRequest): Promise<NextResponse> {

    const FACTORY_ABI: any = ABI;

    const body: FrameRequest = await req.json();
    
    const state = JSON.parse(decodeURIComponent(body.untrustedData.state));

    const data = encodeFunctionData({
        abi: FACTORY_ABI,
        functionName: 'CreateNewCustomToken',
        args: [state.name, state.ticker, BigInt(state.supply.toString()) * BigInt(10**18), process.env.FEE_DEPOSIT_ADDRESS]
    });

    const txData: FrameTransactionResponse = {
        chainId: `eip155:${process.env.CHAIN_ID}`,
        method: 'eth_sendTransaction',
        params: {
            abi: FACTORY_ABI,
            data,
            to: process.env.TOKEN_FACTORY_ADDRESS as `0x${string}`,
            value: parseEther('0').toString()
        }
    }

    return NextResponse.json(txData);
        
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}
  
export const dynamic = 'force-dynamic';