import { encodeFunctionData, parseEther } from 'viem';
import { FrameRequest, FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { ABI } from "@/constants/tokenABI";

async function getResponse(req: NextRequest): Promise<NextResponse> {

    const TOKEN_ABI: any = ABI;

    const contractAddress = req.nextUrl.searchParams.get('contractAddress') || '';

    const body: FrameRequest = await req.json();
    const untrustedData: any = body.untrustedData;

    const amount = BigInt(untrustedData.inputText.toString()) * BigInt(10 ** 18);
    const userAddress = untrustedData.address;

    const data = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [userAddress, amount]
    });

    const txData: FrameTransactionResponse = {
        chainId: `eip155:${process.env.CHAIN_ID}`,
        method: 'eth_sendTransaction',
        params: {
            abi: TOKEN_ABI,
            data,
            to: contractAddress as `0x${string}`,
            value: parseEther('0').toString()
        }
    }

    return NextResponse.json(txData);

}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';